import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgres://postgres:2012@localhost:5432/assignment',
  },
  verbose: true,
  strict: true,
});
