import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders navbar correctly", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    ["Foodies", "Home", "About", "Recipes", "Contact"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
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
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("navigates to login page when Logout button is clicked", () => {
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
});
