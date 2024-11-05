
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

console.log("drizzleindex url", process.env.POSTGRES_URL)
console.log("drizzleindex user", process.env.POSTGRES_USER)
console.log("drizzleindex host", process.env.POSTGRES_HOST)
console.log("drizzleindex database", process.env.POSTGRES_DATABASE)
console.log("drizzleindex password", process.env.POSTGRES_PASSWORD)
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const db = drizzle(pool, { schema });

export { pool, db };

