"use server";
import { getUser, logout } from "../server/auth/auth";
import { fetchMessagesOffCooldown, postMessage } from "../server/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMessage(inputMsg: string) {
  const currUser = await getUser();
  await postMessage(inputMsg, Date.now(), currUser.id);

  revalidatePath("/");
  revalidatePath("/chat");
}

export async function fetchMessagesOffCD() {
  const currUser = await getUser();
  await fetchMessagesOffCooldown(currUser.id, Date.now());
  revalidatePath("/");
  revalidatePath("/chat");
}

export async function logOut() {
  await logout();
  redirect("/");
}
