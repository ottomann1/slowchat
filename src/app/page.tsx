import { isLoggedIn } from "@/server/auth/auth";
import { is } from "drizzle-orm";
import { redirect } from "next/navigation";



export default async function Home() {

  const loggedIn = await isLoggedIn();
  if(!loggedIn){
    return redirect("/login")
  }
  else return redirect("/chat")
}
