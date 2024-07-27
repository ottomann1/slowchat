import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  messages: many(message),
  tokens: one(tokens),
  fetchedMessages: many(fetchedMessages),
}));

export const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  time: timestamp("time").defaultNow().notNull(),
});

export const messageRelations = relations(message, ({ one, many }) => ({
  author: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
  fetchedBy: many(fetchedMessages),
}));

export const tokens = pgTable("tokens", {
  userId: integer("user_id").references(() => user.id),
  dailyTokens: integer("daily_tokens").default(1).notNull(),
  weeklyTokens: integer("weekly_tokens").default(2).notNull(),
});

export const fetchedMessages = pgTable("fetched_messages", {
  userId: integer("user_id").references(() => user.id),
  messageId: integer("message_id").references(() => message.id),
});

export const fetchedMessagesRelations = relations(
  fetchedMessages,
  ({ one }) => ({
    user: one(user, {
      fields: [fetchedMessages.userId],
      references: [user.id],
    }),
    message: one(message, {
      fields: [fetchedMessages.messageId],
      references: [message.id],
    }),
  }),
);
