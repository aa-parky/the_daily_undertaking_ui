// Test setup file

// Mock console.error to suppress expected jsdom navigation errors in tests
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Not implemented: navigation')) {
    // Suppress jsdom navigation errors which are expected in tests
    return;
  }
  originalError.apply(console, args);
};
