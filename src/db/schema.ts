//import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";
import { pgTable, serial, text, varchar, timestamp, integer, boolean, foreignKey } from "drizzle-orm/pg-core";
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});


// Categories table
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(), // e.g., "Tech", "Lifestyle"
  });
  
  // Blog posts table
  export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    category_id: integer("category_id").references(() => categories.id),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  });