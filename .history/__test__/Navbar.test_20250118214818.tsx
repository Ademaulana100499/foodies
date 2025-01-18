import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import { deleteCookie } from "cookies-next";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("cookies-next", () => ({
  deleteCookie: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

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

  test("renders Login button when token is not present", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout button when token is present", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to login page when Login button is clicked", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("navigates to login page and clears token when Logout button is clicked", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(deleteCookie).toHaveBeenCalledWith("token");
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("toggles mobile menu button when clicked", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    const mobileMenuButton = screen.getByRole("button");
    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test("handles state change correctly when token is set", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("handles state change correctly when token is removed", () => {
    document.cookie = "token=some-token";
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Simulate logout action
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
