import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setCookie } from "cookies-next";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { handleLogin } from "@/services/auth";
import { AxiosError } from "axios";
import useLogin from "@/hooks/useLogin";

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

describe("handleFormLogin", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test("login success", async () => {
    const mockResponse = { data: { token: "valid-token" } };
    (handleLogin as jest.Mock).mockResolvedValue(mockResponse);

    render(<button onClick={handleFormLogin}>Login</button>);
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith("token", "valid-token");
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Login Success!",
        icon: "success",
        draggable: true,
        confirmButtonColor: "#F97316",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
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

    render(<button onClick={handleFormLogin}>Login</button>);
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Email or Password is incorrect!",
        icon: "error",
        draggable: true,
        confirmButtonColor: "#F97316",
      });
    });
  });

  test("login failure with unexpected error", async () => {
    const mockError = new Error("Unexpected error");
    (handleLogin as jest.Mock).mockRejectedValue(mockError);

    render(<button onClick={handleFormLogin}>Login</button>);
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "An unexpected error occurred:",
        mockError
      );
    });
  });
});
