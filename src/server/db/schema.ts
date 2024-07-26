import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const userRelations = relations(user, ({ many }) => ({
  message: many(message),
}));

export const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: serial("user_id"),
  content: text("content"),
  time: timestamp("time").defaultNow(),
});

export const messageRelations = relations(message, ({ one }) => ({
  author: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}));
