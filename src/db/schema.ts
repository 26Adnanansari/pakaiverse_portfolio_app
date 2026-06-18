import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull().unique(),
  imageUrl: text("image_url"),
  source: varchar("source", { length: 255 }),
  category: varchar("category", { length: 50 }),
  publishedAt: timestamp("published_at").notNull(),
  author: varchar("author", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
