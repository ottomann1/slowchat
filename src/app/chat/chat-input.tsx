"use client"
import { addMessage } from "@/actions/actions";
import { useState } from "react";


export default function ChatInput(){
  const [newMessage, setNewMessage] = useState('');

return (      <div className="card bg-base-300 rounded-box grid h-20 place-items-center p-4">
        <form action={addMessage}>

        <div className="join">
          <input
            type="text"
            placeholder="Enter your message here..."
            className="input input-bordered w-full max-w-xs"
            name="message"
            onChange={(e) => setNewMessage(e.target.value)}

          />
          <button className="btn" type="submit">
            Send
          </button>

        </div>
          </form>

      </div>)
}
