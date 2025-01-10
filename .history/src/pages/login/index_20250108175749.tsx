import useLogin from "./useLogin";

const LoginPage = () => {
  const { handleFormLogin, setformData, formData } = useLogin();
  return (
    <div className="flex items-center justify-center h-screen bg-[url('https://www.burnaby.ca/sites/default/files/styles/rad_classic_1200w/public/acquiadam/2022-03/food%20systems%20project.jpg?h=c673cd1c&itok=67weI0aD')] bg-cover p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-center text-4xl font-semibold text-orange-600 mb-4">
          Welcome to Foodies
        </h2>

        <input
          type="text"
          onChange={(e) => setformData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          onChange={(e) =>
            setformData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          className="w-full p-3 mb-6 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleFormLogin}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 mb-4"
        >
          Login
        </button>
        <div className="flex items-center justify-center mb-6">
          <span className="h-px w-1/4 bg-gray-300"></span>
          <span className="px-4 text-gray-500 text-sm">Or login with</span>
          <span className="h-px w-1/4 bg-gray-300"></span>
        </div>
        <div className="flex justify-between">
          <button className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
            Facebook
          </button>
          <button className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg ml-2 hover:bg-red-600 transition duration-300">
            Google
          </button>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <a href="#" className="text-orange-500 font-semibold hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
