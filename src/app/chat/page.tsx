import {
  fetchAllUnfetchedMessages,
  fetchFetchedMessages,
  getTokensLeft,
} from "@/server/queries";
import ChatBox from "./chat-box";
import { getUser } from "@/server/auth/auth";
import FetchBox from "./fetch-box";
import Link from "next/link";
import { logOut } from "@/actions/actions";
import { User } from "@/lib/types";

export const dynamic = 'force-dynamic';
export default async function ChatPage() {
  //This is the chat-page! As you can see it collects plenty of data and then prints it in appropriate sections
  const currUser: User = await getUser();
  const fetchesLeft = await getTokensLeft(currUser.id);
  const importMessages = await fetchAllUnfetchedMessages(
    currUser.id,
    Date.now()
  );
  const displayMessages = await fetchFetchedMessages(currUser.id, Date.now());
  const fetchProps = { importMessages, fetchesLeft };

  return (
    <main>
      <header className="flex justify-between p-4">
        <form action={logOut}>
          <button className="btn" type="submit">
            Logout
          </button>
        </form>
        <Link href="/statistics">
          <button className="btn">Statistics</button>
        </Link>
      </header>
      <div className="container mx-auto p-4">
        <ChatBox messages={displayMessages} currUser={currUser} />
        <div className="divider" />
        <FetchBox fetchProps={fetchProps} />
      </div>
    </main>
  );
}
