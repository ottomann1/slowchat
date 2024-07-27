import "server-only";
import { message, user } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

type getMessage = typeof message.$inferSelect;
type NewMessage = typeof message.$inferInsert;
type NewUser = typeof user.$inferInsert;

export async function getMessages(): Promise<getMessage[]> {
  const messages = await db.select().from(message);
  return messages;
}

export async function postMessage(newmsg: NewMessage) {
  newmsg.time = new Date();
  const sentMessage = await db.insert(message).values(newmsg).returning();
  return sentMessage;
}

export async function getDbUserId(userName: string): Promise<number> {
  console.log(userName);
  const userId = await db
    .select()
    .from(user)
    .where(eq(user.name, userName))
    .limit(1);
  console.log(userId);
  return userId[0].id;
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
  return savedUser;
}
