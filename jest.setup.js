import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTop
Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
  get() {
    return this._scrollTop || 0;
  },
  set(value) {
    this._scrollTop = value;
  },
});

Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  get() {
    return this._scrollHeight || 0;
  },
  set(value) {
    this._scrollHeight = value;
  },
});
