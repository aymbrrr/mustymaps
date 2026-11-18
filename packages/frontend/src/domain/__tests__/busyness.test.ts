import { busyLevelFor, hourLabel } from '../busyness';

describe('busyness helpers', () => {
  it('maps low occupancy to dead', () => {
    expect(busyLevelFor(10)).toBe(0);
  });

  it('maps high occupancy to packed', () => {
    expect(busyLevelFor(90)).toBe(4);
  });

  it('formats morning hours correctly', () => {
    expect(hourLabel(9)).toBe('9a');
  });

  it('formats afternoon hours correctly', () => {
    expect(hourLabel(14)).toBe('2p');
  });
});