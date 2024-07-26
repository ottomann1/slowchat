"use client";

import { message } from '@/server/db/schema';
import { useEffect, useState } from 'react';
type Message = typeof message.$inferInsert;

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/getMessages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const newMsg: Omit<Message, 'id'> = {
        userId: 1,
        content: newMessage,
        time: new Date(),
      };
      try {
        const response = await fetch('/api/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMsg),
        });
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        const sentMessage: Message = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="card bg-base-300 rounded-box p-4">
        {messages.map((message) => (
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
  );
}
