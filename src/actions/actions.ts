"use server";
import { getLoggedIn, getUserId } from "@/server/auth/auth";
import { db } from "@/server/db";
import { message } from "@/server/db/schema";
import { postMessage } from "@/server/queries";

type NewMessage = typeof message.$inferInsert;
export async function addMessage(formData: FormData) {
  const currUserId = await getUserId();

  console.log(currUserId);
  console.log(formData);
  const newMsg: NewMessage = {
    userId: Number(currUserId),
    content: formData.get("message") as string,
    time: new Date(),
  };
  const sentMessage = await db.insert(message).values(newMsg).returning();
  return sentMessage;
}
