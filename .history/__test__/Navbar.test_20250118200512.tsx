import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

// Mock useRouter from next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar", () => {
  it("should navigate to login page when Login button is clicked", () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    render(<Navbar />);

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should navigate to login page and clear token when Logout button is clicked", () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Simulating a token
    document.cookie = "token=12345; path=/";

    render(<Navbar />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Check if the token is cleared
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );

    // Check if the router navigates to login page
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
