import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL! },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
});
