import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres({
  user: "postgres",
  host: "localhost",
  database: "finale",
  password: "password",
  port: 5432,
});

const db = drizzle(client);

export { client, db };
