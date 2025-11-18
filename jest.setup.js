// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
global.localStorageMock = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
global.sessionStorageMock = sessionStorageMock;

// Mock window object (only if not already defined)
if (typeof global.window === "undefined") {
  global.window = {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock,
    location: {
      protocol: "http:",
      hostname: "localhost",
    },
    navigator: {
      userAgent: "jest",
    },
  };
} else {
  // If window already exists, update it
  global.window.localStorage = localStorageMock;
  global.window.sessionStorage = sessionStorageMock;
}

