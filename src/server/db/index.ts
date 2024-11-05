
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

console.log("drizzleindex url", process.env.POSTGRES_URL)
console.log("drizzleindex user", process.env.POSTGRES_USER)
console.log("drizzleindex host", process.env.POSTGRES_HOST)
console.log("drizzleindex database", process.env.POSTGRES_DATABASE)
console.log("drizzleindex password", process.env.POSTGRES_PASSWORD)
console.log("drizzleindex public url", process.env.NEXT_PUBLIC_POSTGRES_PASSWORD)

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const db = drizzle(pool, { schema });

export { pool, db };

