import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/login";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("axios");

describe("LoginPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (axios.post as jest.Mock).mockReset();
  });

  test("renders login page correctly", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome to Foodies")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("back button navigates to home", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("successful login redirects to home", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { token: "fake-token" },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("failed login shows error message", async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "Invalid credentials",
        "error"
      );
    });
  });
});
