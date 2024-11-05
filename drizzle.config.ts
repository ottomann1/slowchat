import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.POSTGRES_URL)

console.log(process.env.POSTGRES_USER)
console.log(process.env.POSTGRES_HOST)
console.log(process.env.POSTGRES_DATABASE)
console.log(process.env.POSTGRES_PASSWORD)


export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL! },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
});
