import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// Mocking next/router to simulate navigation
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter("/");
    useRouter.mockReturnValue(mockRouter); // Mocking the useRouter hook directly
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
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
    // Ensure no token is set (use mockRouter for cookie simulation if necessary)
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout button when token is present", () => {
    // Simulate a cookie being set
    document.cookie = "token=some-token"; // Set cookie to simulate login state

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
    // Simulate a token being set and then "logged out"
    document.cookie = "token=some-token"; // Simulate logged-in state

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
