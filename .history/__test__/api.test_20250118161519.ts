import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { fetchAPI } from "@/services/api";

// Membuat instance mock untuk axios
const mock = new AxiosMockAdapter(axios);

describe("fetchAPI", () => {
  afterEach(() => {
    // Reset mock setelah setiap pengujian
    mock.reset();
  });

  test("harus melakukan permintaan API dengan benar", async () => {
    const mockResponse = { data: { token: "fake-token" } };
    const options = {
      method: "POST",
      url: "/login",
      data: { email: "test@example.com", password: "password123" },
    };

    // Setup mock untuk permintaan POST ke '/login'
    mock.onPost("/login").reply(200, mockResponse);

    // Panggil fungsi fetchAPI
    const response = await fetchAPI(options);

    // Pastikan axios dipanggil dengan URL dan headers yang benar
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);

    // Verifikasi permintaan API
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(
      `${process.env.NEXT_PUBLIC_API_URL}/login`
    );
    expect(mock.history.post[0].data).toBe(JSON.stringify(options.data)); // data yang dikirimkan dalam permintaan
  });

  test("harus menangani error jika API mengembalikan kesalahan", async () => {
    const options = {
      method: "POST",
      url: "/login",
      data: { email: "test@example.com", password: "wrongpassword" },
    };

    // Setup mock untuk permintaan POST yang gagal (misalnya 401 Unauthorized)
    mock.onPost("/login").reply(401, { message: "Invalid credentials" });

    // Cek apakah error ditangani dengan benar
    try {
      await fetchAPI(options);
    } catch (error: any) {
      // Pastikan status code dan pesan error sesuai dengan yang diharapkan
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe("Invalid credentials");
    }

    // Verifikasi permintaan API
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(
      `${process.env.NEXT_PUBLIC_API_URL}/login`
    );
  });
});
