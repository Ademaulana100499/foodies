import { fetchAPI } from "./api";

interface LoginData {
  email: string;
  password: string;
}

export const handleLogin = async (loginData: LoginData) => {
  const response = await fetchAPI<{ token: string }>({
    method: "POST",
    url: "/login",
    data: loginData,
  });
  return response; // Mengembalikan data yang diterima dari API
};
