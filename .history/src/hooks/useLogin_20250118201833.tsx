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

      // Pastikan response dan response.data tidak undefined
      if (!response || !response.data || !response.data.token) {
        throw new Error("Invalid response from server");
      }

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
        console.error(error.response?.data?.message || "Login failed");
        Swal.fire({
          title: "Email or Password is incorrect!",
          icon: "error",
          draggable: true,
          confirmButtonColor: "#F97316",
        });
      } else {
        console.error("An unexpected error occurred:", error);
        Swal.fire({
          title: "An unexpected error occurred!",
          text: error instanceof Error ? error.message : "Unknown error",
          icon: "error",
          confirmButtonColor: "#F97316",
        });
      }
    }
  };

  return { handleFormLogin, setFormData, formData };
};

export default useLogin;
