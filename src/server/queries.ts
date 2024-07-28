"use server"
import { message, user, tokens, fetchedMessages } from "./db/schema";
import { db } from "./db";
import { count, eq, lt, inArray, ne, notInArray, and } from "drizzle-orm";
import { Statistics } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getUserId } from "./auth/auth";

type getMessage = typeof message.$inferSelect;
type NewMessage = typeof message.$inferInsert;
type NewUser = typeof user.$inferInsert;
type getUser = typeof user.$inferSelect;
type getToken = typeof tokens.$inferSelect;

export async function findUserById(userId: number): Promise<getUser> {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
  if (!foundUser) throw new Error("User not found");
  return foundUser;
}

export async function findUserByName(userName: string): Promise<getUser> {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.name, userName),
  });
  if (!foundUser) throw new Error("User not found");
  return foundUser;
}

export async function findTokensByUserId(userId: number): Promise<getToken> {
  const foundTokens = await db.query.tokens.findFirst({
    where: eq(tokens.userId, userId),
  });
  if (!foundTokens) throw new Error("Tokens not found");
  return foundTokens;
}

export async function postUser(username: string) {
  const savedUser = await db
    .insert(user)
    .values({ name: username })
    .returning();
  await createFetchTokens(savedUser[0].id);
  return savedUser;
}

export async function createFetchTokens(userId: number) {
  await db
    .insert(tokens)
    .values({ userId, dailyTokens: 1, weeklyTokens: 2 })
    .execute();
}

export async function incrementUserFetches(userId: number) {
  const currUser = await findUserById(userId);
  await db
    .update(user)
    .set({ totalFetches: currUser.totalFetches + 1 })
    .where(eq(user.id, userId))
    .execute();
}

export async function fetchMessagesOffCooldown(userId: number, currDate:number): Promise<any[]> {
  const oneHourAgo = new Date(currDate - 60 * 60 * 1000);
  const messages = await db.query.message.findMany({ with: { author: true } });

  const messagesOffCooldown = messages.filter((msg) => msg.time <= oneHourAgo);
  if (!messagesOffCooldown.length) throw new Error("No fetchable messages");

  const fetchedMessageRecords = messagesOffCooldown.map((msg) => ({
    userId,
    messageId: msg.id,
  }));
  await db.insert(fetchedMessages).values(fetchedMessageRecords).execute();

  await decrementFetchToken(userId);
  await incrementUserFetches(userId);

  return messagesOffCooldown.map((msg) => ({
    id: msg.id,
    content: msg.content,
    time: msg.time,
    author: msg.author,
  }));
}

export async function getTokensLeft(userId: number): Promise<number> {
  const userTokens = await findTokensByUserId(userId);
  return userTokens.dailyTokens + userTokens.weeklyTokens;
}

export async function fetchFetchedMessages(userId: number, currDate:number): Promise<any[]> {
  const fetchedMessageIdsResult = await db
    .select()
    .from(fetchedMessages)
    .where(eq(fetchedMessages.userId, userId))
    .execute();

  const fetchedIds = fetchedMessageIdsResult
    .map((msg) => msg.messageId)
    .filter((id) => id !== null);
  const messages = await db.query.message.findMany({
    with: { author: true },
    where: inArray(message.id, fetchedIds),
  });

  return messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    time: msg.time,
    author: msg.author,
    onCooldown: msg.time > new Date(currDate - 60 * 60 * 1000),
  }));
}

export async function fetchAllUnfetchedMessages(userId: number, currDate:number) {
  const oneHourAgo = new Date(currDate - 60 * 60 * 1000);

  const fetchedMessageIds = await db
    .select()
    .from(fetchedMessages)
    .where(eq(fetchedMessages.userId, userId))
    .execute();
  const fetchedIds = fetchedMessageIds.map((msg) => msg.messageId);

  const messages = await db.query.message.findMany({ with: { author: true } });
  const messagesNotFetched = messages.filter(
    (msg) => !fetchedIds.includes(msg.id)
  );

  return messagesNotFetched.map((msg) => ({
    id: msg.id,
    content: msg.content,
    time: msg.time,
    author: msg.author,
    onCooldown: msg.time > oneHourAgo,
  }));
}

export async function decrementFetchToken(userId: number) {
  const userTokens = await findTokensByUserId(userId);

  if (userTokens.dailyTokens > 0) {
    await db
      .update(tokens)
      .set({ dailyTokens: userTokens.dailyTokens - 1 })
      .where(eq(tokens.userId, userId))
      .execute();
  } else if (userTokens.weeklyTokens > 0) {
    await db
      .update(tokens)
      .set({ weeklyTokens: userTokens.weeklyTokens - 1 })
      .where(eq(tokens.userId, userId))
      .execute();
  } else {
    throw new Error("No fetch tokens left");
  }
}

export async function getStatistics(currDate: number): Promise<Statistics[]> {
  const userMessagesCount = await db
    .select({
      userId: user.id,
      username: user.name,
      totalMessages: count(message.id),
    })
    .from(user)
    .leftJoin(message, eq(user.id, message.userId))
    .groupBy(user.id);

  const userFetchesCount = await db
    .select({ userId: user.id, totalFetches: user.totalFetches })
    .from(user);

  const userFetchesNoCooldownCount = await db
    .select({
      userId: fetchedMessages.userId,
      totalFetchesNoCooldown: count(fetchedMessages.messageId),
    })
    .from(fetchedMessages)
    .leftJoin(message, eq(fetchedMessages.messageId, message.id))
    .where(
      and(
        lt(message.time, new Date(currDate - 60 * 60 * 1000)),
        ne(message.userId, fetchedMessages.userId)
      )
    )
    .groupBy(fetchedMessages.userId);

  const userStatisticsPromises = userMessagesCount.map(async (user) => {
    const usersFetchCount = userFetchesCount.find(
      (fetchCount) => fetchCount.userId === user.userId
    );
    const totalFetches = usersFetchCount?.totalFetches || 0;

    const usersMessagesFetchedCount = userFetchesNoCooldownCount.find(
      (messagesFetched) => messagesFetched.userId === user.userId
    );
    const totalFetchesNoCooldown =
      usersMessagesFetchedCount?.totalFetchesNoCooldown || 0;

    const totalAverageMessagesPerFetch = await averageMessagesPerFetch(
      user.totalMessages,
      totalFetches
    );

    return {
      userId: user.userId,
      username: user.username,
      totalMessages: user.totalMessages,
      totalFetches: totalFetches,
      totalAverageMessagesPerFetch: totalAverageMessagesPerFetch,
      totalFetchesNoCooldown: totalFetchesNoCooldown,
    };
  });

  const userStatistics = await Promise.all(userStatisticsPromises);

  userStatistics.sort((a, b) => a.username.localeCompare(b.username));
  return userStatistics;
}

export async function averageMessagesPerFetch(usersFetchCount: number, usersMessagesFetchedCount: number) {
  let usersAverageMessagesPerFetch = 0;
  if (usersFetchCount > 0 && usersMessagesFetchedCount > 0) {
    usersAverageMessagesPerFetch = usersMessagesFetchedCount / usersFetchCount;
  }
  return usersAverageMessagesPerFetch;
}

export async function postMessage(inputMsg: string, currDate:number) {
  const currUserId = await getUserId();
  const newMsg: NewMessage = {
    userId: Number(currUserId),
    content: inputMsg,
    time: new Date(currDate),
  };

  const sentMessage = await db.insert(message).values(newMsg).returning();
  await db
    .insert(fetchedMessages)
    .values({
      userId: Number(currUserId),
      messageId: sentMessage[0].id,
    })
    .execute();
}

