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
      // Memanggil handleLogin untuk mendapatkan token
      const { token } = await handleLogin(formData);

      // Menyimpan token di cookies
      setCookie("token", token);

      // Mengarahkan pengguna ke halaman utama
      router.push("/");
    } catch (error) {
      alert("Login gagal. Periksa kredensial Anda dan coba lagi.");
    }
  };

  return { handleFormLogin, setformData, formData };
};

export default useLogin;
