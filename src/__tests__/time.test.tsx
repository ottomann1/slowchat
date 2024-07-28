import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkAndResetTokens,
  fetchMessagesOffCooldown,
  findTokensByUserId,
  postMessage,
  postUser,
  resetDatabase,
} from "../server/queries";
import { db } from "../server/db";
describe("Cooldown", async () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("Should be able to fetch a message after one hour", async () => {
    await postUser("Test User");
    await postUser("Test User 2");

    Date.now = vi.fn(() => new Date("2023-01-01T12:00:00Z").getTime());
    await postMessage("testmsg", Date.now(), 1);

    const oneHourLater = new Date("2023-01-01T13:05:00Z").getTime();
    Date.now = vi.fn(() => oneHourLater);

    const result = await fetchMessagesOffCooldown(2, Date.now());

    expect(result).toBeDefined();
  });

  it("Should not be able to fetch a message within one hour", async () => {
    await postUser("Test User");
    await postUser("Test User 2");

    Date.now = vi.fn(() => new Date("2023-01-01T12:00:00Z").getTime());
    await postMessage("testmsg", Date.now(), 1);

    const lessThanOneHourLater = new Date("2023-01-01T12:30:00Z").getTime();
    Date.now = vi.fn(() => lessThanOneHourLater);

    await expect(fetchMessagesOffCooldown(2, Date.now())).rejects.toThrow(
      "No fetchable messages"
    );
  });
});

describe("Tokens", () => {
    beforeEach(async () => {
      await resetDatabase(); // Ensure the database is reset before each test
    });
  
    it("should initialize reset data if it doesn't exist", async () => {
      const now = new Date("2023-01-02T00:00:00Z").getTime();
      await checkAndResetTokens(now);
  
      const resetData = await db.query.tokenReset.findFirst();
      expect(resetData).toBeDefined();
    });
  
    it("should reset daily tokens if a day has passed and cap at 1", async () => {
      await postUser("Test User");
  
      const now = new Date("2023-01-02T00:00:00Z").getTime();
      await checkAndResetTokens(now);
  
      const tokensBefore = await findTokensByUserId(1);
      expect(tokensBefore.dailyTokens).toBe(1);
  
      const nextDay = new Date("2023-01-03T00:00:00Z").getTime();
      await checkAndResetTokens(nextDay);
  
      const tokensAfter = await findTokensByUserId(1);
      expect(tokensAfter.dailyTokens).toBe(1); // Ensure it doesn't exceed 1
    });
  
    it("should reset weekly tokens if a week has passed and cap at 2", async () => {
      await postUser("Test User");
  
      const now = new Date("2023-01-01T00:00:00Z").getTime();
      await checkAndResetTokens(now);
  
      const tokensBefore = await findTokensByUserId(1);
      expect(tokensBefore.weeklyTokens).toBe(2);
  
      const nextWeek = new Date("2023-01-08T00:00:00Z").getTime();
      await checkAndResetTokens(nextWeek);
  
      const tokensAfter = await findTokensByUserId(1);
      expect(tokensAfter.weeklyTokens).toBe(2); // Ensure it doesn't exceed 2
    });
  
    it("should not reset tokens if less than a day has passed", async () => {
      await postUser("Test User");
  
      const now = new Date("2023-01-02T00:00:00Z").getTime();
      await checkAndResetTokens(now);
  
      const tokensBefore = await findTokensByUserId(1);
      expect(tokensBefore.dailyTokens).toBe(1);
  
      const lessThanADayLater = new Date("2023-01-02T12:00:00Z").getTime();
      await checkAndResetTokens(lessThanADayLater);
  
      const tokensAfter = await findTokensByUserId(1);
      expect(tokensAfter.dailyTokens).toBe(1);
    });
  });
  
