import { describe, it, expect } from 'vitest';
import { averageMessagesPerFetch } from '../server/queries';

describe('averageMessagesPerFetch', () => {
  it('should return 0 if usersFetchCount is 0', () => {
    const result = averageMessagesPerFetch(0, 10);
    expect(result).toBe(0);
  });

  it('should return 0 if usersMessagesFetchedCount is 0', () => {
    const result = averageMessagesPerFetch(10, 0);
    expect(result).toBe(0);
  });

  it('should return the correct average if both counts are greater than 0', () => {
    const result = averageMessagesPerFetch(10, 20);
    expect(result).toBe(2);
  });

  it('should return 0 if both counts are 0', () => {
    const result = averageMessagesPerFetch(0, 0);
    expect(result).toBe(0);
  });

  it('should handle large numbers correctly', () => {
    const result = averageMessagesPerFetch(1000000, 5000000);
    expect(result).toBe(5);
  });

  it('should handle divide by zero correctly', () => {
    const result = averageMessagesPerFetch(0, 100);
    expect(result).toBe(0);
  });

  it('should handle when fetches are greater than messages fetched', () => {
    const result = averageMessagesPerFetch(10, 5);
    expect(result).toBe(0.5);
  });
});
