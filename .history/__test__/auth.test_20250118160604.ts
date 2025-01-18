import { handleLogin } from "@/services/auth";
import { fetchAPI } from "@/services/api"; // Import fetchAPI dari path yang sesuai
import { AxiosError } from "axios";

// Mock fetchAPI
jest.mock("@/services/api", () => ({
  fetchAPI: jest.fn(),
}));

describe("handleLogin", () => {
  afterEach(() => {
    // Bersihkan mock setelah setiap test
    jest.clearAllMocks();
  });

  test("harus berhasil melakukan login dan mengembalikan response yang valid", async () => {
    // Mock fetchAPI untuk mengembalikan response yang sukses
    const mockResponse = { data: { token: "fake-token" } };
    (fetchAPI as jest.Mock).mockResolvedValue(mockResponse);

    const loginData = { email: "test@example.com", password: "password123" };

    // Panggil fungsi handleLogin
    const response = await handleLogin(loginData);

    // Periksa apakah fetchAPI dipanggil dengan benar
    expect(fetchAPI).toHaveBeenCalledWith({
      method: "POST",
      url: "/login",
      data: loginData,
    });

    // Periksa apakah hasilnya sesuai dengan yang diharapkan
    expect(response).toEqual(mockResponse);
  });

  test("harus menangani error jika login gagal", async () => {
    // Mock fetchAPI untuk melempar error
    const mockError = new AxiosError("Invalid credentials");
    (fetchAPI as jest.Mock).mockRejectedValue(mockError);

    const loginData = { email: "test@example.com", password: "wrongpassword" };

    // Cek jika fungsi login menanggapi dengan error
    try {
      await handleLogin(loginData);
    } catch (error) {
      // Periksa apakah error yang dilempar adalah AxiosError
      expect(error).toBeInstanceOf(AxiosError);
    }

    // Periksa apakah fetchAPI dipanggil dengan benar meskipun gagal
    expect(fetchAPI).toHaveBeenCalledWith({
      method: "POST",
      url: "/login",
      data: loginData,
    });
  });
});
