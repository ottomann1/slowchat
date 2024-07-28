import { getStatistics } from "@/server/queries";
import Accordion from "./accordion";
import Link from "next/link";

export default async function statistics() {
  //This page collects statistics from the database and then prints them in accordions.
  const stats = await getStatistics(Date.now());

  return (
    <main>
      <header className="p-4">
        <Link href="/chat">
          <button className="btn">Go back</button>
        </Link>
      </header>
      <Accordion stats={stats} />
    </main>
  );
}
