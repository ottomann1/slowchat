import { getStatistics } from "@/server/queries";
import Accordion from "./accordion";
import Link from "next/link";

export default async function statistics() {
  const stats = await getStatistics();

  return (
    <><Link href="/chat">
          <button className="btn">Go back</button>
      </Link><Accordion stats={stats} /></>
  )
}
