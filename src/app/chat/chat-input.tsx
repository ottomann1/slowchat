"use client";
import { addMessage } from "@/actions/actions";
import { useState } from "react";
import { z } from "zod";

const messageSchema = z.string().min(1, { message: "Message cannot be empty" });

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  async function sendMessage() {
    try {
      messageSchema.parse(newMessage);
      await addMessage(newMessage);
      setNewMessage("");
      setError("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <section className="card bg-base-300 rounded-box grid h-20 place-items-center p-4">
      <div className="join">
        <input
          type="text"
          placeholder="Enter your message here..."
          className="input input-bordered w-full max-w-xs"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="btn" onClick={sendMessage}>
          Send
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </section>
  );
}