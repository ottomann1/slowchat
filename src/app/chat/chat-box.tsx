
import { addMessage, logOut } from '@/actions/actions';
import { message } from '@/server/db/schema';
import ChatInput from './chat-input';
import ChatMsgs from './chat-msgs';
import { fetchFetchedMessages } from '@/server/queries';
type Message = typeof message.$inferSelect;
interface ChatBoxProps {
  userId:number
}
export default async function ChatBox({userId}:ChatBoxProps) {

  const messages: Message[]= await fetchFetchedMessages(userId);


  return (

    <div className="flex w-full flex-col">
          <form action={logOut}>
          <button type="submit"> Logout </button>
          </form>
<ChatMsgs messages={messages}/>
      <div className="divider"></div>
<ChatInput/>
    </div>
  );
}
