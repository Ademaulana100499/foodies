import { renderHook, act } from "@testing-library/react";
import useLogin from "@/hooks/useLogin";
import { handleLogin } from "@/services/auth";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { setCookie } from "cookies-next";

// Mocking necessary modules
jest.mock("@/services/auth");
jest.mock("sweetalert2");
jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));

describe("useLogin hook", () => {
  test("login failure with incorrect email or password", async () => {
    // Creating a mock error to simulate login failure
    const mockError = new AxiosError(
      "Email or Password is incorrect", // Error message
      "ERR_BAD_REQUEST", // Error type
      undefined, // Response (optional, can be undefined)
      {
        status: 400, // HTTP status code for "Bad Request"
      }
    );

    // Mock handleLogin to reject with the mockError
    (handleLogin as jest.Mock).mockRejectedValue(mockError);

    // Rendering hook to access hook's result
    const { result } = renderHook(() => useLogin());

    // Setting form data (wrong credentials)
    act(() => {
      result.current.setFormData({
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    // Triggering the login function
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Asserting that Swal.fire is called with the expected error message
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Ensure that cookies were not set and no redirection happens
    expect(setCookie).not.toHaveBeenCalled();
  });
});
