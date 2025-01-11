import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

const useLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormLogin = async () => {
    try {
      const response = await handleLogin(formData);
      setCookie("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Bisa memberikan pesan error ke pengguna jika diperlukan
    }
  };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
