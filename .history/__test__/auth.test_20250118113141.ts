import { handleLogin } from "@/services/auth";
import { fetchAPI } from "@/services/api";
import axios from "axios";

// Mock axios module
jest.mock("axios");

describe("Auth Service - handleLogin", () => {
  test("Mengembalikan token ketika login berhasil", async () => {
    // Mocking axios request yang berhasil
    (axios as unknown as jest.Mock).mockResolvedValue({
      data: { token: "test-token" },
    });

    const response = await handleLogin({
      email: "test@example.com",
      password: "123456",
    });

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/login",
        data: { email: "test@example.com", password: "123456" },
      })
    );
    expect(response.data.token).toBe("test-token");
  });

  test("Melempar error ketika login gagal", async () => {
    // Mocking axios request yang gagal
    (axios as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    await expect(
      handleLogin({ email: "wrong@example.com", password: "wrongpassword" })
    ).rejects.toThrow("Invalid credentials");

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/login",
        data: { email: "wrong@example.com", password: "wrongpassword" },
      })
    );
  });
});
