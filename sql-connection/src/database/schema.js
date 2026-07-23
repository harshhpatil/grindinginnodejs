import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

// exporting the users table schema
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("full_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
