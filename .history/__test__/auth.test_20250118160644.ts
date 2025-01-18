import { handleLogin } from "@/services/auth";
import { fetchAPI } from "@/services/api";
import { AxiosError } from "axios";

jest.mock("@/services/api", () => ({
  fetchAPI: jest.fn(),
}));

describe("handleLogin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("harus berhasil melakukan login dan mengembalikan response yang valid", async () => {
    const mockResponse = { data: { token: "fake-token" } };
    (fetchAPI as jest.Mock).mockResolvedValue(mockResponse);

    const loginData = { email: "test@example.com", password: "password123" };
    const response = await handleLogin(loginData);
    expect(fetchAPI).toHaveBeenCalledWith({
      method: "POST",
      url: "/login",
      data: loginData,
    });
    expect(response).toEqual(mockResponse);
  });

  test("harus menangani error jika login gagal", async () => {
    const mockError = new AxiosError("Invalid credentials");
    (fetchAPI as jest.Mock).mockRejectedValue(mockError);

    const loginData = { email: "test@example.com", password: "wrongpassword" };
    try {
      await handleLogin(loginData);
    } catch (error) {
      expect(error).toBeInstanceOf(AxiosError);
    }
    expect(fetchAPI).toHaveBeenCalledWith({
      method: "POST",
      url: "/login",
      data: loginData,
    });
  });
});
