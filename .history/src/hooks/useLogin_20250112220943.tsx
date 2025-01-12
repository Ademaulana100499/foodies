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
      Swal.fire({
        title: "Login Success!",
        icon: "success",
        draggable: true,
        confirmButtonColor: "#F97316",
      });
      router.push("/");
    } catch (error: unknown) {
      // Gunakan tipe error `unknown`
      if (error instanceof AxiosError) {
        // Periksa apakah error adalah instance dari AxiosError
        console.error(error.response?.data?.message); // Akses message dari response error
        Swal.fire({
          title: "Email or Password is incorrect!",
          icon: "error",
          draggable: true,
          confirmButtonColor: "#F97316",
        });
      } else {
        // Jika error bukan dari Axios, log error secara umum
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  if (!isClient) return { handleFormLogin, setFormData, formData };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
