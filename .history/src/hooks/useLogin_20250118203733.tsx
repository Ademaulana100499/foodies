import { useEffect, useState } from "react";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
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
      Swal.fire({
        title: "Login Success!",
        icon: "success",
        draggable: true,
        confirmButtonColor: "#F97316",
      });
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        Swal.fire({
          title: "Email or Password is incorrect!",
          icon: "error",
          draggable: true,
          confirmButtonColor: "#F97316",
        });
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  if (!isClient) return { handleFormLogin, setFormData, formData };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
