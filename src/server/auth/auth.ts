"use server";
import "dotenv/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { user } from "../db/schema";
import { db } from "../db";
import { getDbUserId, postUser } from "../queries";

type NewUser = typeof user.$inferSelect;
export const auth = async (username: string, password: string) => {
  const sharedPassword = process.env.SHARED_PASSWORD;

  if (password === sharedPassword) {
    cookies().set("slowuser", username);
    await checkAndPostUser(username);
    return { success: true, username };
    redirect("/");
  }

  throw new Error("Invalid password");
};

export async function checkAndPostUser(username: string): Promise<void> {
  try {
    // Check if the user exists in the database
    const userId = await getDbUserId(username);
    // If userId is found, do nothing
    if (userId) {
      console.log(`User ${username} already exists with ID ${userId}`);
      return;
    }
  } catch (error) {
    // If an error occurs during the user check, assume the user does not exist
    console.error(`Error checking user ${username}:`, error);
  }

  // If user does not exist, insert the new user
  try {
    await postUser(username);
    console.log(`User ${username} has been added to the database`);
  } catch (error) {
    console.error(`Error adding user ${username}:`, error);
  }
}

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

export async function getUserId(): Promise<number> {
  const user = await getLoggedIn();
  const currUser = await getDbUserId(user);
  return currUser;
}

export async function logout() {
  // localStorage.removeItem("username");
}
