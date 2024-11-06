"use server";
import "dotenv/config";
import { cookies } from "next/headers";
import { user } from "../db/schema";
import { findUserByName, postUser } from "../queries";

type getUser = typeof user.$inferSelect;
export const auth = async (username: string, password: string) => {
  const sharedPassword = process.env.SHARED_PASSWORD;
  if (password === sharedPassword) {
    cookies().set("slowuser", username);
    await checkAndPostUser(username);
    return { success: true, username };
  }

  throw new Error("Invalid password");
};

export async function checkAndPostUser(username: string) {
  try {
    //Check for user
    const userId = await findUserByName(username);
    if (userId) {
      console.log(`User ${username} already exists with ID ${userId.id}`);
      return;
    }
  } catch (error) {
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

export async function getLoggedIn(): Promise<string | null> {
  const user = cookies().get("slowuser")?.value;
  if (!user) return null;
  return user;
}

export async function getUser(): Promise<getUser> {
  const user = await getLoggedIn();
  if (!user) {
    throw new Error("Not logged in")
  }
  const currUser = await findUserByName(user);
  return currUser;
}

export async function logout() {
  cookies().delete("slowuser");
}
