import { useState, useEffect } from "react";
import { handleLogin } from "@/services/auth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

const useLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormLogin = async () => {
    try {
      const response = await handleLogin(formData);
      setCookie("token", response.data.token);
      Swal.fire({
        title: "Login Success!",
        icon: "success",
        confirmButtonColor: "#F97316",
      });
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Login error:",
          error.response?.data?.message || error.message
        );
        Swal.fire({
          title: "Email or Password is incorrect!",
          icon: "error",
          confirmButtonColor: "#F97316",
        });
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
