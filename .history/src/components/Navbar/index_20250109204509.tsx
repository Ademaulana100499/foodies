import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCookie, removeCookie } from "cookies-next";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    removeCookie("token"); // Hapus token dari cookies
    setIsLoggedIn(false); // Perbarui status login
    router.push("/login"); // Arahkan ke halaman utama setelah logout
  };

  return (
    <nav className="bg-orange-500 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Foodies</div>

        {/* Menu Links */}
        <div className="hidden md:flex space-x-6">
          <a
            href="#home"
            className="text-white hover:text-orange-200 transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-white hover:text-orange-200 transition-colors duration-300"
          >
            About
          </a>
          <a
            href="#recipes"
            className="text-white hover:text-orange-200 transition-colors duration-300"
          >
            Recipes
          </a>
          <a
            href="#contact"
            className="text-white hover:text-orange-200 transition-colors duration-300"
          >
            Contact
          </a>
        </div>

        {/* Button */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-orange-500 font-semibold py-2 px-4 rounded-lg hover:bg-orange-100 transition duration-300"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
