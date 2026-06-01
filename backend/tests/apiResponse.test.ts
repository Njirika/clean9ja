import { describe, it, expect } from 'vitest';
import { ApiResponse } from '../src/utils/ApiResponse';

describe('ApiResponse', () => {
  it('builds a success envelope with data', () => {
    const res = ApiResponse.success('ok', { id: 1 });
    expect(res).toMatchObject({ success: true, message: 'ok', data: { id: 1 } });
  });

  it('omits data from the JSON when none is provided', () => {
    const res = ApiResponse.success('done');
    expect(res.success).toBe(true);
    expect(res.data).toBeUndefined();
    // undefined values are dropped by JSON.stringify, so the wire format has no data key.
    expect(JSON.parse(JSON.stringify(res))).not.toHaveProperty('data');
  });

  it('builds an error envelope', () => {
    const res = ApiResponse.error('nope');
    expect(res).toMatchObject({ success: false, message: 'nope' });
  });
});
