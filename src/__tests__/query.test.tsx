import { describe, it, expect, vi } from 'vitest';
import { averageMessagesPerFetch } from '../server/queries';


vi.mock('server-only', () => ({}));
describe('averageMessagesPerFetch', () => {
  it('should return 0 if usersFetchCount is 0', async () => {
    const result = await averageMessagesPerFetch(0, 10);
    expect(result).toBe(0);
  });

  it('should return 0 if usersMessagesFetchedCount is 0', async () => {
    const result = await averageMessagesPerFetch(10, 0);
    expect(result).toBe(0);
  });

  it('should return the correct average if both counts are greater than 0', async () => {
    const result = await averageMessagesPerFetch(10, 20);
    expect(result).toBe(2);
  });

  it('should return 0 if both counts are 0', async () => {
    const result = await averageMessagesPerFetch(0, 0);
    expect(result).toBe(0);
  });

  it('should handle large numbers correctly', async () => {
    const result = await averageMessagesPerFetch(1000000, 5000000);
    expect(result).toBe(5);
  });

  it('should handle divide by zero correctly', async () => {
    const result = await averageMessagesPerFetch(0, 100);
    expect(result).toBe(0);
  });

  it('should handle when fetches are greater than messages fetched', async () => {
    const result = await averageMessagesPerFetch(10, 5);
    expect(result).toBe(0.5);
  });
});
