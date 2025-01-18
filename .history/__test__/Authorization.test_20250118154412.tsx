import Authorization from "@/components/Layout/Authorization";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthProps } from "@/components/Layout/Authorization/Auth.interface";

const Authorization = ({ children }: AuthProps) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getCookie("token");
      if (!token && router.pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [router]);

  return <>{children}</>;
};

export default Authorization;
