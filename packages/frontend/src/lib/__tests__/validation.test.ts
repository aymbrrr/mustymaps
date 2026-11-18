import { validate } from '../validation';

describe('validation', () => {
  it('accepts passwords with at least 8 characters', () => {
    expect(validate.isValidPassword('12345678')).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(validate.isValidPassword('1234567')).toBe(false);
  });

  it('accepts a Cal Poly email', () => {
    expect(validate.isCalPolyEmail('student@calpoly.edu')).toBe(true);
  });

  it('rejects a non-Cal Poly email', () => {
    expect(validate.isCalPolyEmail('student@gmail.com')).toBe(false);
  });
});