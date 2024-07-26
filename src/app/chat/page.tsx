"use client"

import { useState } from "react";

const fakechats = [
  {
    id: 1,
    userId: 1,
    content: "hello whats up",
    time: new Date(),
  },
  {
    id: 2,
    userId: 1,
    content: "this app is amazing",
    time: new Date(),
  },
  {
    id: 3,
    userId: 2,
    content: "i agree",
    time: new Date(),
  },
];


export default function chat(){
  const [messages, setMessages] = useState(fakechats);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = {
        id: messages.length + 1,
        userId: 1,
        content: newMessage,
        time: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="card bg-base-300 rounded-box p-4">
        {messages.map((message) => (
          <div key={message.id} className="chat chat-start">
            <div className="chat-header">
              User {message.userId}
              <time className="text-xs opacity-50">{message.time.toLocaleTimeString()}</time>
            </div>
            <div className="chat-bubble">{message.content}</div>
          </div>
        ))}
      </div>
      <div className="divider"></div>
      <div className="card bg-base-300 rounded-box grid h-20 place-items-center p-4">
        <div className="join">
          <input
            type="text"
            placeholder="Enter your message here..."
            className="input input-bordered w-full max-w-xs"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button className="btn" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );}
