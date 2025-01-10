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

      // Cek apakah token ada dalam response, jika tidak ada, tampilkan alert
      if (response?.data?.token) {
        setCookie("token", response.data.token);
        router.push("/"); // Redirect ke halaman utama setelah login berhasil
      } else {
        // Jika tidak ada token, beri peringatan
        alert("Email atau password salah!");
      }
    } catch (error) {
      // Menangani error lain yang mungkin terjadi
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  return { handleFormLogin, setformData, formData };
};

export default useLogin;
