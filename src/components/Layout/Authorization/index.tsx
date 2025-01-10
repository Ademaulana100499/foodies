import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthProps } from "./Auth.interface";

const Authorization = ({ children }: AuthProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    if (!token) router.push("/login");
  }, []);

  return children;
};

export default Authorization;
