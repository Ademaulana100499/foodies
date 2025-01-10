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
    const response = await handleLogin(formData);
    setCookie("token", response.data.token);
    router.push("/");
  };
  return { handleFormLogin, setformData, formData };
};

export default useLogin;
