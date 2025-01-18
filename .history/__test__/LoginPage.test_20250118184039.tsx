import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/login";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("render page correctly", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome to Foodies")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Or login with")).toBeInTheDocument();
  });

  test("back button works", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("form inputs work", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "test@example.com"
    );
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
  });

  test("login button works", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
