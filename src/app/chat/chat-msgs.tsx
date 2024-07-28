import { formatDate, formatTime } from "@/lib/dateUtils";
import { MessageWAuthor, User } from "@/lib/types";

interface ChatMsgsProps {
  messages: MessageWAuthor[];
  currUser: User;
}

export default function ChatMsgs({ messages, currUser }: ChatMsgsProps) {
  //This is chatmessages, it prints messages that are fetched.
  return (
    <section
      className="card bg-base-300 rounded-box p-4 flex-grow overflow-y-auto"
      style={{ height: "70vh" }}
    >
      {messages.map((message) => (
        <article
          key={message.id}
          className={`chat ${
            message.author.id === currUser.id ? "chat-end" : "chat-start"
          }`}
        >
          <header className="chat-header">
            <span className="username">{message.author.name}</span>
            <span className="text-xs opacity-50 ml-1">
              {"- "}
              {formatDate(new Date(message.time))} at{" "}
              {formatTime(new Date(message.time))}
            </span>
          </header>
          <p className="chat-bubble">{message.content}</p>
        </article>
      ))}
    </section>
  );
}
