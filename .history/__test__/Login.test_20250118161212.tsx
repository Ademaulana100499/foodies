import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { handleLogin } from "@/services/auth";
import { fetchAPI } from "@/services/api";
import { setCookie } from "cookies-next";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

// Membuat instance mock untuk axios
const mock = new AxiosMockAdapter(axios);

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Login Functionality", () => {
  let routerPush: jest.Mock;

  beforeAll(() => {
    // Mock router.push agar kita bisa memeriksa apakah router berhasil diarahkan
    routerPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: routerPush });
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks(); // Reset mock setelah setiap test
  });

  test("harus berhasil login dan redirect ke halaman utama", async () => {
    const mockResponse = { data: { token: "fake-token" } };
    const formData = { email: "test@example.com", password: "password123" };

    // Setup mock untuk permintaan POST ke '/login'
    mock.onPost("/login").reply(200, mockResponse);

    // Panggil fungsi handleLogin yang ada di hook
    await handleLogin(formData);

    // Pastikan setCookie dipanggil dengan token yang benar
    expect(setCookie).toHaveBeenCalledWith("token", "fake-token");

    // Pastikan SweetAlert menampilkan pesan sukses
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });

    // Pastikan router.push dipanggil setelah login sukses
    expect(routerPush).toHaveBeenCalledWith("/");

    // Verifikasi permintaan API
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(
      `${process.env.NEXT_PUBLIC_API_URL}/login`
    );
    expect(mock.history.post[0].data).toBe(JSON.stringify(formData));
  });

  test("harus menangani error jika login gagal", async () => {
    const formData = { email: "test@example.com", password: "wrongpassword" };

    // Setup mock untuk permintaan POST yang gagal (misalnya 401 Unauthorized)
    mock.onPost("/login").reply(401, { message: "Invalid credentials" });

    // Panggil fungsi handleLogin yang ada di hook dan pastikan menangani error dengan benar
    try {
      await handleLogin(formData);
    } catch (error: any) {
      // Pastikan SweetAlert menampilkan pesan error yang sesuai
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Email or Password is incorrect!",
        icon: "error",
        draggable: true,
        confirmButtonColor: "#F97316",
      });
    }

    // Verifikasi permintaan API
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(
      `${process.env.NEXT_PUBLIC_API_URL}/login`
    );
  });
});
