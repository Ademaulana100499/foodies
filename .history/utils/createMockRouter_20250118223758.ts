import { useRouter } from "next/router";

export const createMockRouter = (initialPath: string) => {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    asPath: initialPath,
    route: initialPath,
    pathname: initialPath,
    query: {},
    isFallback: false,
    isLocaleDomain: false, // Add this property to fix the error
  };
};
