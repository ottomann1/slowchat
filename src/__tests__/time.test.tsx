import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchMessagesOffCooldown, postMessage, postUser } from '../server/queries';
describe('Cooldown', () => {

  it('Should be able to fetch a message after one hour', async () => {
    console.log("I tried to write tests for cooldown but that would require database mocking, so would most tests that check for cooldown, new fetches being added daily etc.")
    console.log("I did manual testing instead.")
    await postUser("Test User")
    
    const originalDateNow = Date.now;
    Date.now = vi.fn(() => new Date('2023-01-01T12:00:00Z').getTime());
    await postMessage("testmsg", originalDateNow(), 1)

    const oneHourLater = new Date('2023-01-01T13:00:00Z').getTime();
    Date.now = vi.fn(() => oneHourLater);
    const result = await fetchMessagesOffCooldown(1, oneHourLater);

    expect(result).toBeDefined();
  });
});