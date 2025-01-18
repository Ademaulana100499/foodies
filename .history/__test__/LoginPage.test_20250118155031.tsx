import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/login";
import useLogin from "@/hooks/useLogin";

// Mock useRouter agar bisa diuji
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock useLogin agar bisa diuji
jest.mock("../../hooks/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("LoginPage Component", () => {
  const mockPush = jest.fn();
  const mockHandleFormLogin = jest.fn();
  const mockSetFormData = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useLogin as jest.Mock).mockReturnValue({
      handleFormLogin: mockHandleFormLogin,
      setFormData: mockSetFormData,
      formData: { email: "", password: "" },
    });
  });

  test("Render halaman login dengan benar", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome to Foodies")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("Tombol back berfungsi dengan benar", () => {
    render(<LoginPage />);
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("Input email dan password dapat diisi", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(mockSetFormData).toHaveBeenCalledTimes(2);
  });

  test("Tombol login memanggil handleFormLogin", () => {
    render(<LoginPage />);
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    expect(mockHandleFormLogin).toHaveBeenCalled();
  });
});
