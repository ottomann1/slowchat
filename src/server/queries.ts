"use server";
import {
  message,
  user,
  tokens,
  fetchedMessages,
  tokenReset,
} from "./db/schema";
import { db } from "./db";
import { count, eq, lt, inArray, ne, and, sql } from "drizzle-orm";
import { Statistics } from "@/lib/types";

type NewMessage = typeof message.$inferInsert;
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
  if (!foundUser) {
    throw new Error(
      `User not found. Most likely the user you have saved in cookies 
      no longer exists in the database. I was going to fix this by redirecting 
      to the main page but for some reason it wouldnt let me redirect from a try catch. 
      Couldn't think of a better way to do it in time so here you go.`
    );
  }
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

export async function fetchMessagesOffCooldown(
  userId: number,
  currDate: number
): Promise<any[]> {
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

export async function fetchFetchedMessages(
  userId: number,
  currDate: number
): Promise<any[]> {
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

export async function fetchAllUnfetchedMessages(
  userId: number,
  currDate: number
) {
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
  try {
    // Fetch user messages count
    const userMessagesCount = await db
      .select({
        userId: user.id,
        username: user.name,
        totalMessages: count(message.id),
      })
      .from(user)
      .leftJoin(message, eq(user.id, message.userId))
      .groupBy(user.id);

    // Fetch total fetches count
    const userFetchesCount = await db
      .select({ userId: user.id, totalFetches: user.totalFetches })
      .from(user);

    // Fetch no cooldown fetches count
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

    // Construct user statistics
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

    // Sort statistics alphabetically by username
    userStatistics.sort((a, b) => a.username.localeCompare(b.username));
    console.log("stats", userStatistics)
    return userStatistics;

  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return []; // Return an empty array or handle the error as needed
  }
}


export async function averageMessagesPerFetch(
  usersFetchCount: number,
  usersMessagesFetchedCount: number
) {
  let usersAverageMessagesPerFetch = 0;
  if (usersFetchCount > 0 && usersMessagesFetchedCount > 0) {
    usersAverageMessagesPerFetch = usersMessagesFetchedCount / usersFetchCount;
  }
  return usersAverageMessagesPerFetch;
}

export async function postMessage(
  inputMsg: string,
  currDate: number,
  currUserId: number
) {
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

export async function checkAndResetTokens(currDate: number) {
  const now = new Date(currDate);
  const resetData = await db.query.tokenReset.findFirst();

  if (!resetData) {
    await db.insert(tokenReset).values({}).execute();
    return;
  }

  const lastDailyReset = new Date(resetData.lastDailyReset);
  const lastWeeklyReset = new Date(resetData.lastWeeklyReset);

  const isDailyResetNeeded = now.getDate() !== lastDailyReset.getDate();
  const isWeeklyResetNeeded =
    now.getDay() === 0 && now.getDate() !== lastWeeklyReset.getDate();

  if (isDailyResetNeeded) {
    await db.execute(sql`
      UPDATE tokens
      SET daily_tokens = LEAST(daily_tokens + 1, 1)
    `);

    await db
      .update(tokenReset)
      .set({
        lastDailyReset: now,
      })
      .execute();
  }

  if (isWeeklyResetNeeded) {
    await db.execute(sql`
      UPDATE tokens
      SET weekly_tokens = LEAST(weekly_tokens + 2, 2)
    `);

    await db
      .update(tokenReset)
      .set({
        lastWeeklyReset: now,
      })
      .execute();
  }
}

export async function resetDatabase() {
  await db.execute(sql`DROP TABLE IF EXISTS fetched_messages`);
  await db.execute(sql`DROP TABLE IF EXISTS tokens`);
  await db.execute(sql`DROP TABLE IF EXISTS messages`);
  await db.execute(sql`DROP TABLE IF EXISTS token_reset`);
  await db.execute(sql`DROP TABLE IF EXISTS users`);

  await db.execute(sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      total_fetches INTEGER DEFAULT 0 NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      content TEXT NOT NULL,
      time TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE tokens (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
      daily_tokens INTEGER DEFAULT 1 NOT NULL,
      weekly_tokens INTEGER DEFAULT 2 NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE fetched_messages (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE NOT NULL
    );
  `);

  await db.execute(sql`
    CREATE TABLE token_reset (
      id SERIAL PRIMARY KEY,
      last_daily_reset TIMESTAMP NOT NULL DEFAULT NOW(),
      last_weekly_reset TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}
