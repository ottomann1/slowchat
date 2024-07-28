import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finale",
  password: "password",
  port: 5432,
});

const db = drizzle(pool, { schema });

export { pool, db };
