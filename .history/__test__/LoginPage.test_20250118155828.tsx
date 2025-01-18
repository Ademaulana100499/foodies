import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/login"; // Pastikan path sesuai dengan lokasi file
import { useRouter } from "next/router"; // Mock next router

// Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("Memastikan LoginPage dirender dengan benar", () => {
    render(<LoginPage />);

    // Memeriksa jika elemen-elemen penting muncul
    expect(screen.getByText("Welcome to Foodies")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Or login with")).toBeInTheDocument();
  });

  test("Memastikan tombol Back bekerja dengan benar", () => {
    render(<LoginPage />);
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("Memastikan form email dan password berfungsi dengan benar", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("Memastikan tombol Login berfungsi saat diklik", () => {
    render(<LoginPage />);

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Misalnya mock fungsi handleLogin untuk memeriksa panggilan
    expect(mockPush).toHaveBeenCalledWith("/dashboard"); // Pastikan sesuai dengan rute login
  });
});
