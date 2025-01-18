import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";
import Cookies from "js-cookie"; // Tambahkan import js-cookie untuk mocking

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter("/");
    jest.spyOn(mockRouter, "push");
    // Set mock cookie value as needed, or reset before each test
    Cookies.get.mockReturnValue(undefined); // Simulate no token by default
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    Cookies.remove.mockClear(); // Clear mock cookies
  });

  test("renders navbar correctly", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Recipes")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
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
    Cookies.get.mockReturnValue("some-token"); // Simulate token present

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

    // Check if push was called with "/login"
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("renders Login button after logout", () => {
    Cookies.get.mockReturnValue("some-token"); // Simulate token present

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // After logout, ensure Login button is displayed
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("calls handleLogin when Login button is clicked", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Ensure that push was called with "/login" and only once
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });
});
