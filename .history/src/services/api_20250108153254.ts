import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchAPI = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      ...options,
    });
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    alert("Terjadi kesalahan saat memanggil API. Silakan coba lagi nanti.");
    throw error; // Melemparkan error agar bisa ditangani di tempat lain
  }
};
