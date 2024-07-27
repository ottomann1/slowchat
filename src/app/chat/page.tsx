import { getMessages } from '@/server/queries';
import ChatBox from './chat-box';
import { message } from '@/server/db/schema';
type Message = typeof message.$inferSelect;
export default async function ChatPage() {
  const messages: Message[]= await getMessages();
  return (
    <div>
      <ChatBox messages={messages} />
    </div>
  );
}
