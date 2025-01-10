import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchAPI = async (
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      ...options,
    });
    return response;
  } catch (error) {
    // Menampilkan alert jika terjadi error
    alert(
      "Terjadi kesalahan saat melakukan permintaan API. Silakan coba lagi.",
    );
    throw error; // Melempar kembali error untuk penanganan lebih lanjut jika diperlukan
  }
};
