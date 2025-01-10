import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchAPI = async (
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
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
        // Periksa status atau pesan error dari server
        if (err.response && err.response.data) {
          // Misalnya, jika error yang diterima berkaitan dengan email atau password
          if (
            err.response.data.message.includes("email") ||
            err.response.data.message.includes("password")
          ) {
            alert("Email atau Password salah");
          } else {
            alert("Terjadi kesalahan: " + err.response.data.message);
          }
        } else {
          // Jika error yang diterima tidak memiliki informasi yang lebih rinci
          alert("Terjadi kesalahan jaringan atau server");
        }
        reject(err);
      });
  });
};
