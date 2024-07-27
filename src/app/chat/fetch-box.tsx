import { fetchMessagesOffCD } from "@/actions/actions";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/lib/dateUtils";

interface FetchProps {
  fetchProps: FetchBoxProps;
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

export default function FetchBox({ fetchProps }: FetchProps) {
  const calculateCooldown = (messageTime: Date) => {
    const now = new Date();
    const cooldownEnd = new Date(messageTime);
    cooldownEnd.setHours(cooldownEnd.getHours() + 1);
    const diff = cooldownEnd.getTime() - now.getTime();
    const minutes = Math.ceil(diff / 1000 / 60);
    return minutes;
  };

  return (
    <div className="flex flex-col items-center">
      <div>Fetches left: {fetchProps.fetchesLeft}</div>
      <form action={fetchMessagesOffCD}>
        <button type="submit" className="btn btn-lg m-4">
          Fetch Messages Off Cooldown
        </button>
      </form>
      <div className="card bg-base-300 rounded-box p-4 text-center">
        <div>Unfetched messages:</div>
        <div>
          {fetchProps.importMessages.map((msg) => (
            <div key={msg.id} className="card bg-neutral p-1 m-1">
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
          ))}
        </div>
      </div>
    </div>
  );
}
