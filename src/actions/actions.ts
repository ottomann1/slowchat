"use server";
import { getUserId, logout } from "../server/auth/auth";
import { message } from "../server/db/schema";
import { fetchMessagesOffCooldown, postMessage } from "../server/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type NewMessage = typeof message.$inferInsert;
export async function addMessage(inputMsg: string) {
  const currUserId = await getUserId();
  await postMessage(inputMsg, Date.now(), currUserId);

  revalidatePath("/");
  revalidatePath("/chat");
}

export async function fetchMessagesOffCD() {
  const currUserId = await getUserId();
  await fetchMessagesOffCooldown(currUserId, Date.now());
  revalidatePath("/");
  revalidatePath("/chat");
}

export async function logOut() {
  await logout();
  redirect("/");
}
