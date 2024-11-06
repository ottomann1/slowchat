import { getStatistics } from "@/server/queries";
import Accordion from "./accordion";
import Link from "next/link";
export const dynamic = 'force-dynamic';
export default async function statistics() {
  //This page collects statistics from the database and then prints them in accordions.
  console.log("prestats")
  const stats = await getStatistics(Date.now());
  console.log("poststats")
  return (
    <main>
      <header className="p-4">
        <Link href="/">
          <button className="btn">Go back</button>
        </Link>
      </header>
      <Accordion stats={stats} />
    </main>
  );
}
