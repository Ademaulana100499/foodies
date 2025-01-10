import useLogin from "./useLogin";

const LoginPage = () => {
  const { handleFormLogin, setformData, formData } = useLogin();
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setformData({ ...formData, email: e.target.value })}
        placeholder="email"
      />
      <input
        type="password"
        onChange={(e) => setformData({ ...formData, password: e.target.value })}
        placeholder="password"
      />
      <button onClick={handleFormLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
import useLogin from "./useLogin";

const LoginPage = () => {
  const { handleFormLogin, setformData, formData } = useLogin();
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setformData({ ...formData, email: e.target.value })}
        placeholder="email"
      />
      <input
        type="password"
        onChange={(e) => setformData({ ...formData, password: e.target.value })}
        placeholder="password"
      />
      <button onClick={handleFormLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
