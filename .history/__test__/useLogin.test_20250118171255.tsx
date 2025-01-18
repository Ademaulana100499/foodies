import { renderHook, act } from "@testing-library/react-hooks";
import useLogin from "@/hooks/useLogin"; // Sesuaikan dengan path yang benar
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Mocking dependencies
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
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  it("should set formData and handle form submission successfully", async () => {
    // Setup mock response
    const mockResponse = { data: { token: "mock-token" } };
    handleLogin.mockResolvedValue(mockResponse);

    // Render the hook
    const { result } = renderHook(() => useLogin());

    // Act: Set formData
    act(() => {
      result.current.setFormData({
        email: "test@test.com",
        password: "password123",
      });
    });

    expect(result.current.formData).toEqual({
      email: "test@test.com",
      password: "password123",
    });

    // Act: Trigger handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assert: Check that setCookie was called with the correct token
    expect(setCookie).toHaveBeenCalledWith("token", "mock-token");

    // Assert: Check that Swal was fired for successful login
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Assert: Check that router.push was called
    expect(mockRouter.push).toHaveBeenCalledWith("/");

    // Assert: Check that handleLogin was called with correct formData
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123",
    });
  });

  it("should handle error when login fails", async () => {
    // Setup mock error response
    const mockError = {
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    };
    handleLogin.mockRejectedValue(mockError);

    // Render the hook
    const { result } = renderHook(() => useLogin());

    // Act: Set formData
    act(() => {
      result.current.setFormData({
        email: "test@test.com",
        password: "wrongpassword",
      });
    });

    // Act: Trigger handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assert: Check that Swal was fired for error
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Assert: Check that handleLogin was called with correct formData
    expect(handleLogin).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "wrongpassword",
    });

    // Assert: Check that console.error was called for logging the error
    expect(console.error).toHaveBeenCalledWith("Invalid credentials");
  });

  it("should handle unexpected error", async () => {
    // Setup mock unexpected error
    handleLogin.mockRejectedValue(new Error("Unexpected error"));

    // Render the hook
    const { result } = renderHook(() => useLogin());

    // Act: Trigger handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Assert: Check that console.error was called for logging the unexpected error
    expect(console.error).toHaveBeenCalledWith(
      "An unexpected error occurred:",
      new Error("Unexpected error")
    );
  });

  it("should return correct default values when not yet client-side", () => {
    // Render the hook
    const { result } = renderHook(() => useLogin());

    // Assert that initial values are correct
    expect(result.current.formData).toEqual({
      email: "",
      password: "",
    });
  });
});
