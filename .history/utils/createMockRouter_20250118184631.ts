// utils/createMockRouter.ts
import { NextRouter } from "next/router";

export const createMockRouter = (
  overrides: Partial<NextRouter> = {}
): NextRouter => ({
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
  ...overrides, // Mengizinkan kita untuk mengoverride nilai-nilai tertentu
});
