import { defineConfig } from 'drizzle-kit';
import "dotenv/config";


console.log("drizzleconf url", process.env.POSTGRES_URL)
console.log("drizzleconf user", process.env.POSTGRES_USER)
console.log("drizzleconf host", process.env.POSTGRES_HOST)
console.log("drizzleconf database", process.env.POSTGRES_DATABASE)
console.log("drizzleconf password", process.env.POSTGRES_PASSWORD)


export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL! },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
});
