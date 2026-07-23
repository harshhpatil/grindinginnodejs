import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";
import "dotenv/config";

const connection = await mysql.createConnection(process.env.DATABASE_URL).catch((err) => {
  console.error("Error connecting to the database:", err);
  process.exit(1);
});
export const db = drizzle(connection, { schema, mode: "default"})