import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalFetches: integer("total_fetches").default(0).notNull(),
});

export const message = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  time: timestamp("time").defaultNow().notNull(),
});

export const tokens = pgTable("tokens", {
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .primaryKey(),
  dailyTokens: integer("daily_tokens").default(1).notNull(),
  weeklyTokens: integer("weekly_tokens").default(2).notNull(),
});

export const fetchedMessages = pgTable("fetched_messages", {
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  messageId: integer("message_id")
    .references(() => message.id, { onDelete: "cascade" })
    .notNull(),
});

export const tokenReset = pgTable("token_reset", {
  id: serial("id").primaryKey(),
  lastDailyReset: timestamp("last_daily_reset").defaultNow().notNull(),
  lastWeeklyReset: timestamp("last_weekly_reset").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  messages: many(message),
  tokens: one(tokens, {
    fields: [user.id],
    references: [tokens.userId],
  }),
  fetchedMessages: many(fetchedMessages),
}));

export const messageRelations = relations(message, ({ one, many }) => ({
  author: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
  fetchedBy: many(fetchedMessages),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(user, {
    fields: [tokens.userId],
    references: [user.id],
  }),
}));

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
  })
);
