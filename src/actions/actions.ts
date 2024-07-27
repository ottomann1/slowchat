"use server";
import { getLoggedIn, getUserId, logout } from "@/server/auth/auth";
import { db } from "@/server/db";
import { fetchedMessages, message } from "@/server/db/schema";
import { fetchMessagesOffCooldown, postMessage } from "@/server/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  await db
    .insert(fetchedMessages)
    .values({
      userId: Number(currUserId),
      messageId: sentMessage[0].id,
    })
    .execute();
  redirect("/");
}

export async function fetchMessagesOffCD() {
  const currUserId = await getUserId();
  await fetchMessagesOffCooldown(currUserId);
  redirect("/");
}

export async function logOut() {
  await logout();
  redirect("/");
}
