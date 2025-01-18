export function createMockRouter(initialPath = "/") {
  return {
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  asPath: initialPath,
  route: "/",
  query: {},
  pathname: initialPath,
  basePath: "",
  isFallback: false,
});

  
