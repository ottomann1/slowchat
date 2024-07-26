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

const fakechats = [
  {
    id: 1,
    userId: 1,
    content: "hello whats up",
    time: new Date(),
  },
  {
    id: 2,
    userId: 1,
    content: "this app is amazing",
    time: new Date(),
  },
  {
    id: 3,
    userId: 2,
    content: "i agree",
    time: new Date(),
  },
];
