import { fetchAllUnfetchedMessages, fetchFetchedMessages, getMessages, getTokensLeft } from '@/server/queries';
import ChatBox from './chat-box';
import { message, user } from '@/server/db/schema';
import { getUserId } from '@/server/auth/auth';
import FetchBox from './fetch-box';
type Message = typeof message.$inferSelect;
type User = typeof user.$inferSelect;
export default async function ChatPage() {
  const currUserId: number = await getUserId();
  const fetchesLeft = await getTokensLeft(currUserId);
  const importMessages = await fetchAllUnfetchedMessages(currUserId);
  const fetchProps = {importMessages, fetchesLeft}
  console.log("tokens left ", fetchesLeft)
  console.log("fetchporps", fetchProps)
  return (
    <div>
      <ChatBox userId={currUserId} />

      <FetchBox fetchProps={fetchProps}/>

    </div>
  );
}
