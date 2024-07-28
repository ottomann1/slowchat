import { findUserByName } from '@/server/queries';
import { vi } from 'vitest';


vi.mock('../server/auth/auth', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      getUserId: vi.fn().mockResolvedValue(1), // Mock implementation for getUserId
      getUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' }), // Mock implementation for getUser if needed
    };
  });

vi.mock('../server/queries', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      findUserByName: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' })
    };
  });
  
vi.mock('next/headers', () => {
    return {
        cookies: () => ({
          get: vi.fn((name) => {
            if (name === 'slowuser') {
              return { value: 'TestUser' }; // Return the mock value for the slowuser cookie
            }
            return undefined;
          }),
          set: vi.fn(),
        }),
      };
});
