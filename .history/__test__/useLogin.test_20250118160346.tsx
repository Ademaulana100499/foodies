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

describe("hook useLogin", () => {
  const mockPush = jest.fn();
  const mockHandleLogin = require("@/services/auth").handleLogin;
  const mockFire = Swal.fire;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("harus menangani login dengan sukses", async () => {
    mockHandleLogin.mockResolvedValue({
      data: { token: "fake-token" },
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password123",
      });
    });

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(setCookie).toHaveBeenCalledWith("token", "fake-token");

    expect(mockFire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("harus menangani login dengan error (email/password salah)", async () => {
    mockHandleLogin.mockRejectedValue(new AxiosError("Invalid credentials"));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "wrongpassword",
      });
    });

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(mockFire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });

  test("harus menangani perubahan data form", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(result.current.formData.email).toBe("test@example.com");
    expect(result.current.formData.password).toBe("password123");
  });
});
