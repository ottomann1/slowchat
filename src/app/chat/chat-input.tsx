"use client";
import { addMessage } from "@/actions/actions";
import { sendMsgHandler } from "@/lib/msgHandler";
import { useState } from "react";

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState("");

  async function sendMessage(){
                addMessage(newMessage);
                setNewMessage("")
  }
  return (
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
                sendMessage();
              }
            }}
          />
          <button className="btn" onClick={sendMessage}>
            Send
          </button>
        </div>
    </div>
  );
}
