import { defineConfig } from 'drizzle-kit';



export default defineConfig({
  dialect: "postgresql",
  //yes this is not how you should do it but next.js refuses to load my
  //environment variables during build and i cba
  dbCredentials: { url: process.env.POSTGRES_URL! },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
});
