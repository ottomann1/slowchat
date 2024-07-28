import { getLoggedIn } from "@/server/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  //This page checks if you are logged in. If you aren't, it sends you to the login. If you are then it sends you to the chat
  const loggedIn = await getLoggedIn();
  if (!loggedIn) {
    return redirect("/login");
  } else return redirect("/chat");
}
