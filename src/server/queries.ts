import "server-only";
import { message, user } from "./db/schema";
import { db } from "./db";

type NewMessage = typeof message.$inferInsert;
type NewUser = typeof user.$inferInsert;

export async function getMessages(): Promise<NewMessage[]> {
  const messages = await db.select().from(message);
  return messages;
}

export async function writeMessage(newmsg: NewMessage) {
  newmsg.time = new Date();
  const sentMessage = await db.insert(message).values(newmsg).returning();
  return sentMessage;
}

export async function getUsers() {
  const users = await db.select().from(user);
  return users;
}

export async function saveUser(newUser: NewUser) {
  const savedUser = await db.insert(user).values(newUser).returning();
  return savedUser;
}
