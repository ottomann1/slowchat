import { formatDate, formatTime } from "@/lib/dateUtils";

interface ChatMsgsProps {
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

export default function ChatMsgs({ messages }: ChatMsgsProps) {

  return (
    <div className="card bg-base-300 rounded-box p-4">
      {messages.map((message) => (
        <div key={message.id} className="chat chat-start">
          <div className="chat-header">
            <span className="username">{message.author.name}</span>
            <span className="text-xs opacity-50 ml-1">
              {"- "}
              {formatDate(new Date(message.time))} at{" "}
              {formatTime(new Date(message.time))}
            </span>
          </div>
          <div className="chat-bubble">{message.content}</div>
        </div>
      ))}
    </div>
  );
}
