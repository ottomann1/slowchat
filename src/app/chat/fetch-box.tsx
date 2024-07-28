"use client"

import { useState } from "react";
import { fetchMessagesOffCD } from "@/actions/actions";
import { formatDate, formatTime } from "@/lib/dateUtils";
import { MessageWACD } from "@/lib/types";
import Error from "../_components/error";

interface FetchProps {
  fetchProps: FetchBoxProps;
}

interface FetchBoxProps {
  importMessages: MessageWACD[];
  fetchesLeft: number;
}

export default function FetchBox({ fetchProps }: FetchProps) {
  const [error, setError] = useState<string | null>(null);

  // This is the "fetchbox", it prints which messages are ready to be fetched and also which messages aren't ready to be fetched.
  function calculateCooldown(messageTime: Date) {
    const now = new Date();
    const cooldownEnd = new Date(messageTime);
    cooldownEnd.setHours(cooldownEnd.getHours() + 1);
    const diff = cooldownEnd.getTime() - now.getTime();
    const minutes = Math.ceil(diff / 1000 / 60);
    return minutes;
  }

  const handleFetch = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      await fetchMessagesOffCD();
    } catch (err) {
      setError("No fetchable messages at the moment. Please try again later.");
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div>Fetches left: {fetchProps.fetchesLeft}</div>
      <form onSubmit={handleFetch}>
        <button type="submit" className="btn btn-lg m-4">
          Fetch Messages Off Cooldown
        </button>
      </form>
      {error && (
        <div className="w-full max-w-md my-2">
          <Error
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
      <article className="card bg-base-300 rounded-box p-4 text-center w-full">
        <header>
          <h2>Unfetched messages:</h2>
        </header>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {fetchProps.importMessages.map((msg) => (
            <div key={msg.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <div className="indicator">
                {!msg.onCooldown && (
                  <span className="indicator-item badge badge-success">
                    Ready
                  </span>
                )}
                {msg.onCooldown && (
                  <span className="indicator-item badge badge-error">
                    {calculateCooldown(new Date(msg.time))} min
                  </span>
                )}
                <div className="card bg-neutral p-4 m-1">
                  <p>
                    <strong>Message from {msg.author.name}</strong>
                    <br />
                    {msg.onCooldown
                      ? `On cooldown for ${calculateCooldown(
                          new Date(msg.time)
                        )} minutes`
                      : `Ready to be fetched`}
                  </p>
                  <p>
                    <em>
                      Posted {formatDate(new Date(msg.time))} at{" "}
                      {formatTime(new Date(msg.time))}
                    </em>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
