import { useEffect, useState } from "react";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
const useLogin = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormLogin = async () => {
    try {
      const response = await handleLogin(formData);
      setCookie("token", response.data.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        title: "Email or Password is incorrect!",
        icon: "error",
        draggable: true,
      });
    }
  };

  if (!isClient) return { handleFormLogin, setFormData, formData };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
