import { renderHook, act } from "@testing-library/react";
import useLogin from "../../hooks/useLogin"; // Sesuaikan path
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

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

describe("useLogin Hook", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("Form data dapat diubah", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "123456",
      });
    });

    expect(result.current.formData).toEqual({
      email: "test@example.com",
      password: "123456",
    });
  });

  test("handleFormLogin berhasil ketika login sukses", async () => {
    (handleLogin as jest.Mock).mockResolvedValue({
      data: { token: "test-token" },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(handleLogin).toHaveBeenCalled();
    expect(setCookie).toHaveBeenCalledWith("token", "test-token");
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("handleFormLogin menampilkan error ketika login gagal", async () => {
    (handleLogin as jest.Mock).mockRejectedValue(
      new AxiosError("Request failed", {
        response: { data: { message: "Invalid credentials" } },
      })
    );

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(handleLogin).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });
});
