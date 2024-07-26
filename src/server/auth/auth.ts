"use server";
import "dotenv/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { user } from "../db/schema";

type NewUser = typeof user.$inferSelect;
export const auth = async (username: string, password: string) => {
  const sharedPassword = process.env.SHARED_PASSWORD;

  if (password === sharedPassword) {
    cookies().set("slowuser", username);
    return { success: true, username };
    redirect("/");
  }

  throw new Error("Invalid password");
};

export async function isLoggedIn(): Promise<boolean> {
  const user = cookies().get("slowuser")?.value;
  if (!user) return false;
  else return true;
}

export async function getLoggedIn(): Promise<string> {
  const user = cookies().get("slowuser")?.value;
  if (!user) return "";
  return user;
}

export async function logout() {
  // localStorage.removeItem("username");
}
