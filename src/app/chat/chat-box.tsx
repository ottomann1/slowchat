import ChatInput from "./chat-input";
import ChatMsgs from "./chat-msgs";
import { MessageWAuthor, User } from "@/lib/types";
interface ChatBoxProps {
  messages: MessageWAuthor[];
  currUser: User;
}

export default async function ChatBox({ messages, currUser }: ChatBoxProps) {
  //This chatbox is just something to make my code a bit more separated and easier to read
  return (
    <section className="flex w-full flex-col">
      <ChatMsgs messages={messages} currUser={currUser} />
      <div className="divider" />
      <ChatInput />
    </section>
  );
}
