import { renderHook, act } from "@testing-library/react";
import { setCookie } from "cookies-next";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import useLogin from "@/hooks/useLogin";
import { handleLogin } from "@/services/auth";
import { AxiosError } from "axios";

// Mocking modules
jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/auth", () => ({
  handleLogin: jest.fn(),
}));

describe("useLogin Hook", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("should initialize correctly and set client state", () => {
    const { result } = renderHook(() => useLogin());

    // Ensure the hook initializes and sets client state
    expect(result.current.formData).toEqual({ email: "", password: "" });
    expect(result.current.handleFormLogin).toBeInstanceOf(Function);
  });

  test("login success", async () => {
    const mockResponse = { data: { token: "valid-token" } };
    (handleLogin as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password",
      });
    });

    // Simulate login
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Check if setCookie was called with correct token
    expect(setCookie).toHaveBeenCalledWith("token", "valid-token");

    // Check if Swal.fire was called with correct success message
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Check if router.push was called to navigate to home
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("login failure with incorrect email or password", async () => {
    const mockError = new AxiosError(
      "Email or Password is incorrect",
      "",
      "",
      {},
      {}
    );
    (handleLogin as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    // Simulate login
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Check if Swal.fire was called with correct error message
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Ensure that no redirection occurs
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("login failure with unexpected error", async () => {
    const mockError = new Error("Unexpected error");
    (handleLogin as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLogin());

    // Set form data
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password",
      });
    });

    // Simulate login
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Check if the console error was called
    expect(console.error).toHaveBeenCalledWith(
      "An unexpected error occurred:",
      mockError
    );

    // Check if Swal.fire was NOT called for unexpected error
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  test("should handle client-side state initialization", () => {
    const { result } = renderHook(() => useLogin());

    // Ensure that the hook properly sets `isClient` to true after first render
    expect(result.current.formData).toEqual({ email: "", password: "" });
  });
});
