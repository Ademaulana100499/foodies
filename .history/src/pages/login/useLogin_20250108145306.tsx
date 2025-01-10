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
      console.log("Login response:", response); // Debug: Memeriksa response API

      if (response?.data?.token) {
        setCookie("token", response.data.token);
        router.push("/");
      } else {
        alert("Gagal mendapatkan token dari server.");
      }
    } catch (error) {
      console.error("Login error:", error); // Debug: Menampilkan error lengkap
      alert("Terjadi kesalahan saat login. Pastikan email dan password benar.");
    }
  };

  return { handleFormLogin, setformData, formData };
};

export default useLogin;
