import { renderHook, act } from "@testing-library/react";
import useLogin from "@/hooks/useLogin";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

// Mocking dependensi eksternal
jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));
jest.mock("@/services/auth", () => ({
  handleLogin: jest.fn(),
}));

describe("useLogin hook", () => {
  const mockPush = jest.fn();
  const mockHandleLogin = require("@/services/auth").handleLogin;
  const mockFire = Swal.fire;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should handle form login success", async () => {
    // Mock login success
    mockHandleLogin.mockResolvedValue({
      data: { token: "fake-token" },
    });

    const { result } = renderHook(() => useLogin());

    // Simulate form input
    act(() => {
      result.current.setFormData({ email: "test@example.com", password: "password123" });
    });

    // Call handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assert setCookie was called
    expect(setCookie).toHaveBeenCalledWith("token", "fake-token");

    // Assert Swal success popup is triggered
    expect(mockFire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Assert navigation happens
    expect(mockPush).toHaveBeenCalledWith("/");

  });

  test("should handle form login error (incorrect email/password)", async () => {
    // Mock login failure
    mockHandleLogin.mockRejectedValue(new AxiosError("Invalid credentials"));

    const { result } = renderHook(() => useLogin());

    // Simulate form input
    act(() => {
      result.current.setFormData({ email: "test@example.com", password: "wrongpassword" });
    });

    // Call handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assert Swal error popup is triggered
    expect(mockFire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });

  test("should handle form data change", async () => {
    const { result } = renderHook(() => useLogin());

    // Simulate email input change
    act(() => {
      result.curr
