import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../src/utils/jwt';

// NODE_ENV is not 'production' under test, so env.ts uses its dev secret.
describe('jwt utils', () => {
  it('round-trips userId and role', () => {
    const token = generateToken('user-123', 'admin');
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe('user-123');
    expect(decoded.role).toBe('admin');
  });

  it('rejects a tampered token', () => {
    const token = generateToken('user-123', 'customer');
    expect(() => verifyToken(token + 'tampered')).toThrow();
  });
});
