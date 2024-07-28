"use client";
import { addMessage } from "@/actions/actions";
import { useState } from "react";
import { z } from "zod";
import Error from "../_components/error";

const messageSchema = z.string().min(1, { message: "Message cannot be empty" });

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    <section className="card bg-base-300 rounded-box grid place-items-center p-4 h-auto">
      <div className="flex flex-col sm:flex-row w-full items-center">
        <input
          type="text"
          placeholder="Enter your message here..."
          className="input input-bordered flex-grow w-full sm:w-auto mb-2 sm:mb-0 sm:mr-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="btn w-full sm:w-auto" onClick={sendMessage}>
          Send
        </button>
      </div>
      {error && (
        <div className="w-half m-4">
          <Error message={error} onClose={() => setError(null)} />
        </div>
      )}
    </section>
  );
}
