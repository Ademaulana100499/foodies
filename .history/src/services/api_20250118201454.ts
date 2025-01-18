import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const fetchAPI = async (
  options: AxiosRequestConfig
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
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
