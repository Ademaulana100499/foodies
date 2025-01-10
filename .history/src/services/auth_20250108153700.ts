import { fetchAPI } from "./api";

interface LoginData {
  email: string;
  password: string;
}

export const handleLogin = async (loginData: LoginData) => {
  return await fetchAPI({
    method: "POST",
    url: "/login",
    data: loginData,
  });
};
