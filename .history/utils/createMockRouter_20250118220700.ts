export function createMockRouter(initialPath = "/") {
  return {
    push: jest.fn(),
    pathname: initialPath,
    query: {},
    asPath: initialPath,
  };
}
