import { pgTable, text, timestamp, varchar, serial, boolean } from "drizzle-orm/pg-core";

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

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  projectType: varchar("project_type", { length: 100 }),
  budget: varchar("budget", { length: 50 }),
  message: text("message"),
  source: varchar("source", { length: 50 }).default("website"),
  status: varchar("status", { length: 50 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guest_post_orders = pgTable("guest_post_orders", {
  id: serial("id").primaryKey(),
  userEmail: varchar("user_email", { length: 255 }),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  packageName: varchar("package_name", { length: 50 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }).notNull(),
  targetKeyword: varchar("target_keyword", { length: 255 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("Unpaid"),
  paymentProofUrl: text("payment_proof_url"),
  orderStatus: varchar("order_status", { length: 50 }).default("Pending"),
  startDate: timestamp("start_date"),
  expireDate: timestamp("expire_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  content: text("content"),
  published: boolean("published").default(false),
  author: varchar("author", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const funnels = pgTable("funnels", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  stepCompleted: varchar("step_completed", { length: 50 }).default("opt_in"),
  source: varchar("source", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

