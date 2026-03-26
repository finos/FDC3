import { describe, it, expect } from 'vitest';

describe('Window object', () => {
  it('fdc3 property should be present but undefined', () => {
    expect(window.fdc3).toBe(undefined);
  });
});
