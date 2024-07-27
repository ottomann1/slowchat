import {
  fetchAllUnfetchedMessages,
  fetchFetchedMessages,
  getMessages,
  getTokensLeft,
} from "@/server/queries";
import ChatBox from "./chat-box";
import { message, user } from "@/server/db/schema";
import { getUser } from "@/server/auth/auth";
import FetchBox from "./fetch-box";
import Link from "next/link";
import { logOut } from "@/actions/actions";
import { formatDate, formatTime } from "@/lib/dateUtils";
type Message = typeof message.$inferSelect;
type User = typeof user.$inferSelect;

export default async function ChatPage() {
  const currUser: User = await getUser();
  const fetchesLeft = await getTokensLeft(currUser.id);
  const importMessages = await fetchAllUnfetchedMessages(currUser.id);
  const displayMessages = await fetchFetchedMessages(currUser.id);
  const fetchProps = { importMessages, fetchesLeft };
  console.log("tokens left ", fetchesLeft);
  console.log("fetchporps", fetchProps);

  return (
    <div>
      <div className="flex justify-between p-4">
        <form action={logOut}>
          <button className="btn" type="submit"> Logout </button>
        </form>
        <Link href="/statistics">
          <button className="btn">Statistics</button>
        </Link>
      </div>
      <ChatBox messages={displayMessages} />
      <div className="divider"></div>
      <FetchBox fetchProps={fetchProps} />
    </div>
  );
}
