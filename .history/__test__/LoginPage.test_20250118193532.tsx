import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/login";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

// Mocking next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mocking axios untuk menghindari panggilan HTTP yang sebenarnya
jest.mock("axios");

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

  test("login button works and navigates to dashboard on success", async () => {
    // Mocking API response untuk login berhasil
    axios.post.mockResolvedValue({
      data: {
        token: "fake-token",
      },
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
      // Memastikan token disimpan dan halaman berpindah
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(screen.queryByText("Login Success!")).toBeInTheDocument();
    });
  });

  test("login button shows error on failure", async () => {
    // Mocking API response untuk login gagal
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
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
      // Memastikan Swal muncul dan halaman tidak berpindah
      expect(mockPush).not.toHaveBeenCalled();
      expect(
        screen.queryByText("Email or Password is incorrect!")
      ).toBeInTheDocument();
    });
  });
});
