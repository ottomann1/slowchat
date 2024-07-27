"use client"
import { message } from "@/server/db/schema";
import { useState } from "react";

type Message = typeof message.$inferSelect;
interface ChatMsgsProps {
  messages: Message[];
}

export default function ChatMsgs({ messages }: ChatMsgsProps){

  const [currMessages, setMessages] = useState<Message[]>(messages);
  return (
      <div className="card bg-base-300 rounded-box p-4">
        {currMessages.map((message) => (
          <div key={message.id} className="chat chat-start">
            <div className="chat-header">
              User {message.userId}
              <time className="text-xs opacity-50">{message.time?.toLocaleString()}</time>
            </div>
            <div className="chat-bubble">{message.content}</div>
          </div>
        ))}
      </div>
  )
}
