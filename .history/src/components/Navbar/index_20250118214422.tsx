import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";

const Navbar = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    setToken(cookies ? cookies.split("=")[1] : null);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    deleteCookie("token");
    setToken(null);
    router.push("/");
  };

  return (
    <nav className="bg-orange-500 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto md-px-16 px-4 py-3 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Foodies</div>
        <div className="hidden md:flex space-x-6">
          <Link
            href="/#home"
            className="text-white hover:text-orange-200 transition-colors duration-300">
            Home
          </Link>
          <Link
            href="/#about"
            className="text-white hover:text-orange-200 transition-colors duration-300">
            About
          </Link>
          <Link
            href="/#recipes"
            className="text-white hover:text-orange-200 transition-colors duration-300">
            Recipes
          </Link>
          <Link
            href="/#contact"
            className="text-white hover:text-orange-200 transition-colors duration-300">
            Contact
          </Link>
        </div>
        <div className="hidden md:block">
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition duration-300">
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-orange-500 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition duration-300">
              Login
            </button>
          )}
        </div>
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
