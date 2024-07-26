import { isLoggedIn } from "@/server/auth/auth";
import { is } from "drizzle-orm";
import { redirect } from "next/navigation";



export default async function Home() {

  const loggedIn = await isLoggedIn();
  console.log(loggedIn)
  if(!loggedIn){
    return redirect("/login")
  }
  else return (
    <main>
    <h1>This is the main page</h1>

    </main>
  );
}
