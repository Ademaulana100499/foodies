export const createMockRouter = (overrides = {}) => ({
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  asPath: "/",
  route: "/",
  query: {},
  pathname: "/",
  basePath: "",
  isFallback: false,
  ...overrides,
});
