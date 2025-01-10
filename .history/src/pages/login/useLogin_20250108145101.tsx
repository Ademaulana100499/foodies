import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

const useLogin = () => {
  const router = useRouter();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const handleFormLogin = async () => {
    try {
      const response = await handleLogin(formData);
      setCookie("token", response.data.token);
      router.push("/");
    } catch (error) {
      alert("Terjadi kesalahan saat login. Pastikan email dan password benar.");
      console.error("Login error:", error);
    }
  };

  return { handleFormLogin, setformData, formData };
};

export default useLogin;
