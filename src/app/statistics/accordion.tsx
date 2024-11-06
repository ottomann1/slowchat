import { Statistics } from "@/lib/types";

interface StatisticProps {
  stats: Statistics[];
}
export default function Accordion({ stats }: StatisticProps) {
  console.log("accordionstats", stats)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.userId}>
            <div className="collapse bg-base-200">
              <input type="radio" name="accordio" />
              <div className="collapse-title text-xl font-medium">
                {stat.username}
              </div>
              <div className="collapse-content">
                <ul>
                  <li>Total Messages: {stat.totalMessages}</li>
                  <li>Total Fetches: {stat.totalFetches}</li>
                  <li>
                    Average Messages per Fetch:{" "}
                    {stat.totalAverageMessagesPerFetch.toFixed(2)}
                  </li>
                  <li>Total Messages Fetched: {stat.totalFetchesNoCooldown}</li>
                </ul>{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
