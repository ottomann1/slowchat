import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkAndResetTokens,
  decrementFetchToken,
  fetchMessagesOffCooldown,
  findTokensByUserId,
  findUserById,
  findUserByName,
  getTokensLeft,
  incrementUserFetches,
  postMessage,
  postUser,
  resetDatabase,
} from "../server/queries";
import { db } from "../server/db";
import { auth, checkAndPostUser, getLoggedIn, getUser } from "../server/auth/auth";
import { cookies } from "next/headers";
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

  vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }))
  }));
  
  describe('auth', () => {
    beforeEach(async () => {
      await resetDatabase();
    });
  
    it('should authenticate a user with the correct password', async () => {
      process.env.SHARED_PASSWORD = 'correctpassword';
      const result = await auth('testuser', 'correctpassword');
      expect(result).toEqual({ success: true, username: 'testuser' });
    });
  
    it('should throw an error for an incorrect password', async () => {
      process.env.SHARED_PASSWORD = 'correctpassword';
      await expect(auth('testuser', 'wrongpassword')).rejects.toThrow('Invalid password');
    });
  });
  
  describe('checkAndPostUser', () => {
    beforeEach(async () => {
      await resetDatabase();
    });
  
    it('should add a new user if they do not exist', async () => {
      await checkAndPostUser('newuser');
      const newUser = await findUserByName('newuser');
      expect(newUser).toBeDefined();
      expect(newUser.name).toBe('newuser');
    });
  
    it('should return null if no user is logged in', async () => {
      vi.mocked(cookies().get).mockReturnValue(undefined);
      const result = await getLoggedIn();
      expect(result).toBeNull();
    });
  });
  
  describe('getUser', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('testuser');
    });
  
    it('should throw an error if no user is logged in', async () => {
      vi.mocked(cookies().get).mockReturnValue(undefined);
      await expect(getUser()).rejects.toThrow('Not logged in');
    });
  });
  
  describe('findUserById', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should return the user details for a given user ID', async () => {
      const user = await findUserById(1);
      expect(user).toBeDefined();
      expect(user.name).toBe('user1');
    });
  
    it('should throw an error if the user does not exist', async () => {
      await expect(findUserById(999)).rejects.toThrow('User not found');
    });
  });
  
  describe('findUserByName', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should return the user details for a given username', async () => {
      const user = await findUserByName('user1');
      expect(user).toBeDefined();
      expect(user.name).toBe('user1');
    });
  
    it('should throw an error if the user does not exist', async () => {
      await expect(findUserByName('unknown')).rejects.toThrow(
        'User not found. Most likely the user you have saved in cookies no longer exists in the database.'
      );
    });
  });
  
  describe('findTokensByUserId', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should return the tokens for a given user ID', async () => {
      const tokens = await findTokensByUserId(1);
      expect(tokens).toBeDefined();
      expect(tokens.dailyTokens).toBe(1);
      expect(tokens.weeklyTokens).toBe(2);
    });
  
    it('should throw an error if the tokens are not found', async () => {
      await expect(findTokensByUserId(999)).rejects.toThrow('Tokens not found');
    });
  });
  
  describe('incrementUserFetches', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should increment the total fetches for a given user ID', async () => {
      await incrementUserFetches(1);
      const user = await findUserById(1);
      expect(user.totalFetches).toBe(1);
    });
  });
  
  describe('getTokensLeft', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should return the total tokens left for a given user ID', async () => {
      const tokensLeft = await getTokensLeft(1);
      expect(tokensLeft).toBe(3);
    });
  });
  
  describe('decrementFetchToken', () => {
    beforeEach(async () => {
      await resetDatabase();
      await postUser('user1');
    });
  
    it('should decrement daily tokens if daily tokens are available', async () => {
      await decrementFetchToken(1);
      const tokens = await findTokensByUserId(1);
      expect(tokens.dailyTokens).toBe(0);
      expect(tokens.weeklyTokens).toBe(2);
    });
  
    it('should decrement weekly tokens if daily tokens are not available', async () => {
      await decrementFetchToken(1); // Decrement daily tokens to 0
      await decrementFetchToken(1); // Decrement weekly tokens to 1
      const tokens = await findTokensByUserId(1);
      expect(tokens.dailyTokens).toBe(0);
      expect(tokens.weeklyTokens).toBe(1);
    });
  
    it('should throw an error if no fetch tokens are left', async () => {
      await decrementFetchToken(1); // Decrement daily tokens to 0
      await decrementFetchToken(1); // Decrement weekly tokens to 1
      await decrementFetchToken(1); // Decrement weekly tokens to 0
      await expect(decrementFetchToken(1)).rejects.toThrow('No fetch tokens left');
    });
  });