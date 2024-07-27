
"use client";
import { fetchMessagesOffCD } from "@/actions/actions";
import { useEffect, useState } from "react";

interface FetchProps{
  fetchProps: FetchBoxProps
}

interface FetchBoxProps {
  importMessages: Message[];
  fetchesLeft: number;
}

interface Author {
  id: number;
  name: string;
}

interface Message {
  id: number;
  content: string;
  time: Date;
  author: Author;
  onCooldown: boolean;
}

export default function FetchBox({ fetchProps }:FetchProps) {
  const [messages, setMessages] = useState<Message[]>(fetchProps.importMessages);
  const [tokens, setTokens] = useState<number>(fetchProps.fetchesLeft);

  console.log(tokens, fetchProps.fetchesLeft)

  return (
    <div>
    <div>Fetches left: {tokens}</div>
    <form action={fetchMessagesOffCD}>
    <button type="submit" className="btn">Fetch Messages Of Cooldown</button>
    </form>
      {messages.map((msg) => (
        <div key={msg.id} style={{ backgroundColor: msg.onCooldown ? 'lightcoral' : 'lightgreen' }}>
          <p><strong>{msg.author.name}</strong>: {msg.onCooldown ? "Message is on cooldown" : msg.content}</p>
          <p><em>{new Date(msg.time).toLocaleString()}</em></p>
        </div>
      ))}
    </div>
  );
}
