// useLogin.test.ts
import { renderHook, act } from "@testing-library/react";
import useLogin from "./useLogin";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

// Mock modules
jest.mock("@/services/auth", () => ({
  handleLogin: jest.fn(),
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("useLogin hook", () => {
  const mockRouterPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  test("should initialize formData and handleFormLogin correctly", async () => {
    const { result } = renderHook(() => useLogin());

    // Initial state check
    expect(result.current.formData).toEqual({ email: "", password: "" });

    // Mock response
    const mockResponse = { data: { token: "fake_token" } };
    (handleLogin as jest.Mock).mockResolvedValue(mockResponse);

    // Trigger handleFormLogin
    await act(async () => {
      result.current.setFormData({
        email: "test@test.com",
        password: "password123",
      });
      await result.current.handleFormLogin();
    });

    // Check if the token was set in cookies
    expect(setCookie).toHaveBeenCalledWith("token", "fake_token");

    // Check if SweetAlert was called for success
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Check if navigation happened
    expect(mockRouterPush).toHaveBeenCalledWith("/");

    // Ensure formData was updated correctly
    expect(result.current.formData).toEqual({
      email: "test@test.com",
      password: "password123",
    });
  });

  test("should handle error correctly when login fails", async () => {
    const { result } = renderHook(() => useLogin());

    // Mock error response
    const mockError: AxiosError = {
      response: { data: { message: "Email or password is incorrect!" } },
      message: "Request failed",
      name: "AxiosError",
      config: {},
      isAxiosError: true,
      toJSON: jest.fn(),
    };
    (handleLogin as jest.Mock).mockRejectedValue(mockError);

    // Trigger handleFormLogin
    await act(async () => {
      result.current.setFormData({
        email: "wrong@test.com",
        password: "wrongpassword",
      });
      await result.current.handleFormLogin();
    });

    // Check if SweetAlert was called for error
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Ensure formData was updated
    expect(result.current.formData).toEqual({
      email: "wrong@test.com",
      password: "wrongpassword",
    });
  });

  test("should handle unexpected error correctly", async () => {
    const { result } = renderHook(() => useLogin());

    // Mock unexpected error
    (handleLogin as jest.Mock).mockRejectedValue(new Error("Unexpected Error"));

    // Trigger handleFormLogin
    await act(async () => {
      result.current.setFormData({
        email: "unexpected@test.com",
        password: "wrongpassword",
      });
      await result.current.handleFormLogin();
    });

    // Check if console.error is called for unexpected error
    expect(console.error).toHaveBeenCalledWith(
      "An unexpected error occurred:",
      new Error("Unexpected Error")
    );
  });

  test("should only execute after client side rendering", () => {
    const { result } = renderHook(() => useLogin());

    // Checking for client-side rendering
    expect(result.current.isClient).toBe(true);
  });
});
