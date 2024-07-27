import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getMessages,
  postMessage,
  getDbUser,
  postUser,
  createFetchTokens,
  fetchMessagesOffCooldown,
  getUserTokens,
  getTokensLeft,
} from "../server/queries";
import { db } from '../server/db';
import { message, user, tokens, fetchedMessages } from '../server/db/schema';


vi.mock('../server/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      user: {
        findFirst: vi.fn(),
      },
      message: {
        findMany: vi.fn(),
      },
      tokens: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe('Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMessages', () => {
    it('should return messages from the database', async () => {
      const mockMessages = [{ id: 1, content: 'Hello World' }];
      db.select.mockReturnValueOnce({
        from: vi.fn().mockResolvedValueOnce(mockMessages),
      });

      const result = await getMessages();

      expect(result).toEqual(mockMessages);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('postMessage', () => {
    it('should insert a new message and return it', async () => {
      const newMessage = { content: 'New Message', userId: 1, time: new Date() };
      const mockSentMessage = [{ id: 1, ...newMessage }];
      db.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockResolvedValueOnce(mockSentMessage),
        }),
      });

      const result = await postMessage(newMessage);

      expect(result).toEqual(mockSentMessage);
      expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ values: expect.any(Function) }));
    });
  });

  describe('getDbUser', () => {
    it('should return a user by username', async () => {
      const mockUser = { id: 1, name: 'testuser' };
      db.query.user.findFirst.mockResolvedValueOnce(mockUser);

      const result = await getDbUser('testuser');

      expect(result).toEqual(mockUser);
      expect(db.query.user.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({ name: 'testuser' }),
      });
    });

    it('should throw an error if user is not found', async () => {
      db.query.user.findFirst.mockResolvedValueOnce(null);

      await expect(getDbUser('nonexistentuser')).rejects.toThrow('User not found');
    });
  });

  describe('postUser', () => {
    it('should insert a new user and create fetch tokens', async () => {
      const newUser = { id: 1, name: 'newuser' };
      db.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockResolvedValueOnce([newUser]),
        }),
      });

      const createFetchTokensMock = vi.spyOn(
        require('../path/to/your/module'),
        'createFetchTokens'
      ).mockResolvedValueOnce();

      const result = await postUser('newuser');

      expect(result).toEqual([newUser]);
      expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ values: expect.any(Function) }));
      expect(createFetchTokensMock).toHaveBeenCalledWith(newUser.id);
    });
  });

  describe('fetchMessagesOffCooldown', () => {
    it('should return messages off cooldown and update fetch records', async () => {
      const userId = 1;
      const mockMessages = [
        { id: 1, content: 'Message 1', time: new Date(Date.now() - 3600000) },
        { id: 2, content: 'Message 2', time: new Date(Date.now() - 7200000) },
      ];
      db.query.message.findMany.mockResolvedValueOnce(mockMessages);

      const dbInsertMock = db.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          execute: vi.fn().mockResolvedValueOnce(),
        }),
      });

      const decrementFetchTokenMock = vi.spyOn(
        require('../path/to/your/module'),
        'decrementFetchToken'
      ).mockResolvedValueOnce();

      const incrementUserFetchesMock = vi.spyOn(
        require('../path/to/your/module'),
        'incrementUserFetches'
      ).mockResolvedValueOnce();

      const result = await fetchMessagesOffCooldown(userId);

      expect(result).toEqual(mockMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        time: msg.time,
        author: msg.author,
      })));
      expect(db.query.message.findMany).toHaveBeenCalled();
      expect(dbInsertMock).toHaveBeenCalledWith(expect.objectContaining({ values: expect.any(Function) }));
      expect(decrementFetchTokenMock).toHaveBeenCalledWith(userId);
      expect(incrementUserFetchesMock).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if no messages are off cooldown', async () => {
      const userId = 1;
      db.query.message.findMany.mockResolvedValueOnce([]);

      await expect(fetchMessagesOffCooldown(userId)).rejects.toThrow('No fetchable messages');
    });
  });

  describe('getUserTokens', () => {
    it('should return user tokens', async () => {
      const userId = 1;
      const mockTokens = { userId, dailyTokens: 1, weeklyTokens: 2 };
      db.query.tokens.findFirst.mockResolvedValueOnce(mockTokens);

      const result = await getUserTokens(userId);

      expect(result).toEqual(mockTokens);
      expect(db.query.tokens.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({ userId }),
      });
    });

    it('should throw an error if tokens are not found', async () => {
      const userId = 1;
      db.query.tokens.findFirst.mockResolvedValueOnce(null);

      await expect(getUserTokens(userId)).rejects.toThrow('cant find tokens');
    });
  });

  describe('getTokensLeft', () => {
    it('should return the total number of tokens left', async () => {
      const userId = 1;
      const mockTokens = { userId, dailyTokens: 1, weeklyTokens: 2 };
      db.query.tokens.findFirst.mockResolvedValueOnce(mockTokens);

      const result = await getTokensLeft(userId);

      expect(result).toBe(3);
      expect(db.query.tokens.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({ userId }),
      });
    });

    it('should throw an error if tokens are not found', async () => {
      const userId = 1;
      db.query.tokens.findFirst.mockResolvedValueOnce(null);

      await expect(getTokensLeft(userId)).rejects.toThrow("Can't find tokens for the user");
    });
  });
});
