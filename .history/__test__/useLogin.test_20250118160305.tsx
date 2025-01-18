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
  const mockPush = jest.fn(); // Mock fungsi push dari useRouter
  const mockHandleLogin = require("@/services/auth").handleLogin;
  const mockFire = Swal.fire;

  beforeEach(() => {
    // Mock router untuk mengembalikan objek dengan fungsi push
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    // Bersihkan mock setelah setiap test
    jest.clearAllMocks();
  });

  test("harus menangani login dengan sukses", async () => {
    // Mock berhasil login dengan mengembalikan token
    mockHandleLogin.mockResolvedValue({
      data: { token: "fake-token" },
    });

    const { result } = renderHook(() => useLogin());

    // Simulasi input form
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Panggil fungsi handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Pastikan setCookie dipanggil untuk menyimpan token
    expect(setCookie).toHaveBeenCalledWith("token", "fake-token");

    // Pastikan Swal sukses dipanggil
    expect(mockFire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Pastikan navigasi terjadi setelah login sukses
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("harus menangani login dengan error (email/password salah)", async () => {
    // Mock gagal login (email/password salah)
    mockHandleLogin.mockRejectedValue(new AxiosError("Invalid credentials"));

    const { result } = renderHook(() => useLogin());

    // Simulasi input form
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "wrongpassword",
      });
    });

    // Panggil fungsi handleFormLogin
    await act(async () => {
      await result.current.handleFormLogin();
    });

    // Pastikan Swal error dipanggil
    expect(mockFire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });

  test("harus menangani perubahan data form", async () => {
    const { result } = renderHook(() => useLogin());

    // Simulasi perubahan input email dan password
    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Periksa apakah data form diubah dengan benar
    expect(result.current.formData.email).toBe("test@example.com");
    expect(result.current.formData.password).toBe("password123");
  });
});
