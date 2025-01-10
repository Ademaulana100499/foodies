import useLogin from "./useLogin";
import { useState } from "react";

const LoginPage = () => {
  const { handleFormLogin, setformData, formData } = useLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async () => {
    setError("");
    setSuccess("");
    if (!formData.email || !formData.password) {
      setError("Email and Password cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await handleFormLogin();
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        // Redirect or further action
        window.location.href = "/dashboard"; // Ganti dengan halaman tujuan
      }, 2000);
    } catch (err) {
      setError("Failed to login. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[url('https://www.burnaby.ca/sites/default/files/styles/rad_classic_1200w/public/acquiadam/2022-03/food%20systems%20project.jpg?h=c673cd1c&itok=67weI0aD')] bg-cover p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-3xl font-semibold text-orange-600 mb-6">
          Welcome to Foodies
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-lg text-sm">
            {success}
          </div>
        )}

        <input
          type="text"
          onChange={(e) => setformData({ ...formData, email: e.target.value })}
          value={formData.email}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
          value={formData.password}
          placeholder="Password"
          className="w-full p-3 mb-6 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg transition duration-300 ${
            loading
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
