import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchAPI = async (
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return new Promise((resolve) => {
    axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      ...options,
    })
      .then((res) => resolve(res))
      .catch((err) => {
        // Menangani kesalahan dan memberikan pesan khusus
        alert("Email atau password salah");
      });
  });
};
