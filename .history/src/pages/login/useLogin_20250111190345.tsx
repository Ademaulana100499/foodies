import { useEffect, useState } from "react";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

const useLogin = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Cek jika aplikasi dijalankan di sisi klien
    setIsClient(true);
  }, []);

  const handleFormLogin = async () => {
    try {
      const response = await handleLogin(formData);
      setCookie("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Hanya mengembalikan data jika sudah dijalankan di klien
  if (!isClient) return { handleFormLogin, setFormData, formData };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
