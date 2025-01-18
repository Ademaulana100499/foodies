export function createMockRouter(overrides: any = {}) {
  return {
    push: jest.fn(),
    query: {},
    pathname: "/",
    asPath: "/",
    prefetch: jest.fn(),
    ...overrides,
  };
}
