import useLogin from "./useLogin";

const LoginPage = () => {
  const { handleFormLogin, setformData, formData } = useLogin();
  return (
    <div className="flex items-center justify-center h-screen bg-[url('https://www.burnaby.ca/sites/default/files/styles/rad_classic_1200w/public/acquiadam/2022-03/food%20systems%20project.jpg?h=c673cd1c&itok=67weI0aD')] p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-3xl font-semibold text-orange-600 mb-6">
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
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
