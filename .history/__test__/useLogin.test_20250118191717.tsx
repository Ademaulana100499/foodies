import { renderHook, act } from "@testing-library/react";
import useLogin from "@/hooks/useLogin";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

// Mock necessary dependencies
jest.mock("@/services/auth");
jest.mock("cookies-next");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("sweetalert2");

describe("useLogin", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("should log in successfully", async () => {
    // Mock successful login response
    const mockResponse = {
      data: {
        token: "mockToken",
      },
    };
    (handleLogin as jest.Mock).mockResolvedValueOnce(mockResponse);
    (setCookie as jest.Mock).mockImplementationOnce(() => {});
    (Swal.fire as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password",
      });
    });

    // Simulate form submission
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assertions
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(setCookie).toHaveBeenCalledWith("token", "mockToken");
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("should show error when login fails", async () => {
    // Mock failed login response
    const mockError = new AxiosError(
      "Invalid credentials",
      "POST",
      "",
      {},
      {},
      {}
    );
    (handleLogin as jest.Mock).mockRejectedValueOnce(mockError);
    (Swal.fire as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "wrongPassword",
      });
    });

    // Simulate form submission
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assertions
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "wrongPassword",
    });
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });

  test("should handle unexpected errors", async () => {
    // Mock an unexpected error
    const mockError = new Error("Unexpected error");
    (handleLogin as jest.Mock).mockRejectedValueOnce(mockError);
    (Swal.fire as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password",
      });
    });

    // Simulate form submission
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assertions
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "An unexpected error occurred:",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });
});
