import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchAPI = async (
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  try {
    const res = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      ...options,
    });
    return res; // Mengembalikan response dari axios
  } catch (err) {
    // Menangani error dan menampilkan alert
    alert("Terjadi kesalahan saat memanggil API. Silakan coba lagi nanti.");
    throw err; // Meneruskan error agar bisa ditangani lebih lanjut
  }
};
