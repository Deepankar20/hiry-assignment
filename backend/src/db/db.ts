import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  connectionString: "postgres://postgres:2012@localhost:5432/hiry-assignment",
});



client.connect();
export const db = drizzle(client);