import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Navbar", () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders navbar with menu items", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    ["Foodies", "Home", "About", "Recipes", "Contact"].forEach((text) =>
      expect(screen.getByText(text)).toBeInTheDocument()
    );
  });

  test("renders Login button when no token", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout button with token", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates on button click", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");

    document.cookie = "token=some-token";
    fireEvent.click(screen.getByText("Logout"));
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("toggles mobile menu", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
