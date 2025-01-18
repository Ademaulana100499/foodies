import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
    document.cookie = mockRouter.query.token ? "token=some-token" : "";
  });

  test("renders navbar links", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    ["Home", "About", "Recipes", "Contact"].forEach((text) =>
      expect(screen.getByText(text)).toBeInTheDocument()
    );
  });

  test("shows Login button if no token", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows Logout button if token exists", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("Login redirects to login page", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("Logout clears token and redirects", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(document.cookie).toBe(
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("mobile menu toggle", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
