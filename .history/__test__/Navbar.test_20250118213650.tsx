import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders navbar items", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders Login when no token", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout when token is present", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to login on Login click", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("logs out on Logout click", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });
});
