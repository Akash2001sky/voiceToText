const mockStart = jest.fn(() => Promise.resolve());
const mockStop = jest.fn(() => Promise.resolve());

export const Voice = {
  isAvailable: jest.fn(() => Promise.resolve(true)),
  start: mockStart,
  stop: mockStop,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  removeAllListeners: jest.fn(),
  results: jest.fn(() => Promise.resolve(['hello', 'world'])),
};