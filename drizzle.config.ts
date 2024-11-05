import { defineConfig } from 'drizzle-kit';


console.log("drizzleconf url", process.env.POSTGRES_URL)
console.log("drizzleconf user", process.env.POSTGRES_USER)
console.log("drizzleconf host", process.env.POSTGRES_HOST)
console.log("drizzleconf database", process.env.POSTGRES_DATABASE)
console.log("drizzleconf password", process.env.POSTGRES_PASSWORD)


export default defineConfig({
  dialect: "postgresql",
  //yes this is not how you should do it but next.js refuses to load my
  //environment variables during build and i cba
  dbCredentials: { url: "postgres://postgres:party@34.88.234.134:5432/postgres" },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
});
