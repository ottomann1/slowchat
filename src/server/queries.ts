import "server-only";
import { message, user, tokens, fetchedMessages } from "./db/schema";
import { db } from "./db";
import { eq, inArray, ne, notInArray } from "drizzle-orm";

type getMessage = typeof message.$inferSelect;
type NewMessage = typeof message.$inferInsert;
type NewUser = typeof user.$inferInsert;
type getUser = typeof user.$inferSelect;
type getToken = typeof tokens.$inferSelect;

export async function getMessages(): Promise<getMessage[]> {
  const messages = await db.select().from(message);
  return messages;
}

export async function postMessage(newmsg: NewMessage) {
  newmsg.time = new Date();
  const sentMessage = await db.insert(message).values(newmsg).returning();
  return sentMessage;
}

export async function getDbUser(userName: string): Promise<getUser> {
  console.log(userName);

  const gottenUser = await db.query.user.findFirst({
    where: eq(user.name, userName),
  });
  if (!gottenUser) throw new Error("User not found");
  return gottenUser;
}

export async function getUsers() {
  const users = await db.select().from(user);
  return users;
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

export async function fetchMessagesOffCooldown(userId: number): Promise<any[]> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const messages = await db.query.message.findMany({
    with: {
      author: true,
    },
  });

  const messagesOffCooldown = messages.filter((msg) => msg.time <= oneHourAgo);

  const fetchedMessageRecords = messagesOffCooldown.map((msg) => ({
    userId,
    messageId: msg.id,
  }));

  await db.insert(fetchedMessages).values(fetchedMessageRecords).execute();

  decrementFetchToken(userId);
  return messagesOffCooldown.map((msg) => ({
    id: msg.id,
    content: msg.content,
    time: msg.time,
    author: msg.author,
  }));
}

export async function getUserTokens(userId: number): Promise<getToken> {
  const userTokens = await db.query.tokens.findFirst({
    where: eq(tokens.userId, userId),
  });
  if (!userTokens) throw new Error("cant find tokens");
  return userTokens;
}

export async function getTokensLeft(userId: number): Promise<number> {
  const userTokens = await db.query.tokens.findFirst({
    where: eq(tokens.userId, userId),
  });

  if (!userTokens) throw new Error("Can't find tokens for the user");

  const totalTokensLeft = userTokens.dailyTokens + userTokens.weeklyTokens;
  return totalTokensLeft;
}

export async function fetchFetchedMessages(userId: number): Promise<any[]> {
  // Get IDs of messages already fetched by the user
  const fetchedMessageIdsResult = await db
    .select()
    .from(fetchedMessages)
    .where(eq(fetchedMessages.userId, userId))
    .execute();

  const fetchedIds = fetchedMessageIdsResult
    .map((msg) => msg.messageId)
    .filter((id) => id !== null);

  // Fetch messages with the fetched IDs
  const messages = await db.query.message.findMany({
    with: {
      author: true,
    },
    where: inArray(message.id, fetchedIds),
  });

  return messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    time: msg.time,
    author: msg.author,
    onCooldown: msg.time > new Date(new Date().getTime() - 60 * 60 * 1000),
  }));
}

export async function fetchAllUnfetchedMessages(userId: number) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const fetchedMessage = await db
    .select()
    .from(fetchedMessages)
    .where(eq(fetchedMessages.userId, userId));

  const fetchedIds = fetchedMessage.map((msg) => msg.messageId);
  if (!fetchedIds) throw new Error("fetched ids is null");

  const messages = await db.query.message.findMany({
    with: {
      author: true,
    },
  });
  const messagesNotFetched = messages.filter(
    (msg) => !fetchedIds.includes(msg.id),
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
  const userTokens = await getUserTokens(userId);

  if (userTokens.dailyTokens > 0) {
    await db
      .update(tokens)
      .set({
        dailyTokens: userTokens.dailyTokens - 1,
      })
      .where(eq(tokens.userId, userId));
  } else if (userTokens.weeklyTokens > 0) {
    await db
      .update(tokens)
      .set({
        weeklyTokens: userTokens.weeklyTokens - 1,
      })
      .where(eq(tokens.userId, userId));
  } else {
    throw new Error("No fetch tokens left");
  }
}
