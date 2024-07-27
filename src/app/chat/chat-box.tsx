"use client";

import { addMessage } from '@/actions/actions';
import { message } from '@/server/db/schema';
import { useEffect, useState } from 'react';
type Message = typeof message.$inferSelect;
interface ChatBoxProps {
  messages: Message[];
}
export default function ChatBox({ messages }: ChatBoxProps) {
  const [currMessages, setMessages] = useState<Message[]>(messages);
  const [newMessage, setNewMessage] = useState('');



  return (
    <div className="flex w-full flex-col">
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
      <div className="divider"></div>
      <div className="card bg-base-300 rounded-box grid h-20 place-items-center p-4">
        <div className="join">
        <form action={addMessage}>
          <input
            type="text"
            placeholder="Enter your message here..."
            className="input input-bordered w-full max-w-xs"
            name="message"

          />
          <button className="btn" type="submit">
            Send
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}
