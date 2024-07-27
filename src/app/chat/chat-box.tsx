import { addMessage, logOut } from "@/actions/actions";
import { message } from "@/server/db/schema";
import ChatInput from "./chat-input";
import ChatMsgs from "./chat-msgs";
import { fetchFetchedMessages } from "@/server/queries";
interface ChatBoxProps {
  messages: Message[];
}

interface Message {
  id: number;
  userId: number;
  content: string;
  time: Date;
  author: {
    id: number;
    name: string;
  };
}

export default async function ChatBox({ messages }: ChatBoxProps) {

  return (
    <div className="flex w-full flex-col">
      <ChatMsgs messages={messages} />
      <div className="divider"></div>
      <ChatInput />
    </div>
  );
}
