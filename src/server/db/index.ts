
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";
import { sql } from "drizzle-orm";

// Load environment variables"drizzle url",  from .env file
console.log("drizzleindex url", process.env.POSTGRES_URL)

console.log("drizzleindex user", process.env.POSTGRES_USER)
console.log("drizzleindex host", process.env.POSTGRES_HOST)
console.log("drizzleindex database", process.env.POSTGRES_DATABASE)
console.log("drizzleindex password", process.env.POSTGRES_PASSWORD)
const pool = new Pool({
  user: "postgres",
  host: "34.88.234.134",
  database: "postgres",
  password: "party",
  port: 5432,
});

const db = drizzle(pool, { schema });
export default async function handler() {
  try {
    const result = await db.execute(sql`SELECT NOW() AS currentTime`); // Simple test query
    console.log({ message: "Database connection successful", result });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
handler()
export { pool, db };

