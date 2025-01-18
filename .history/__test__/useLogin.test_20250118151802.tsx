import { renderHook, act } from "@testing-library/react-hooks";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import Swal from "sweetalert2";
import { handleLogin } from "@/services/auth";
import useLogin from "@/hooks/useLogin";

jest.mock("@/services/auth");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
}));
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("useLogin hook", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("should update formData correctly", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setFormData({
        email: "test@example.com",
        password: "123456",
      });
    });

    expect(result.current.formData).toEqual({
      email: "test@example.com",
      password: "123456",
    });
  });

  it("should handle successful login", async () => {
    (handleLogin as jest.Mock).mockResolvedValue({
      data: { token: "mockToken123" },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(setCookie).toHaveBeenCalledWith("token", "mockToken123");
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Login Success!",
      icon: "success",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("should handle login failure", async () => {
    (handleLogin as jest.Mock).mockRejectedValue({
      response: { data: { message: "Email or Password is incorrect!" } },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleFormLogin();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Email or Password is incorrect!",
      icon: "error",
      draggable: true,
      confirmButtonColor: "#F97316",
    });
  });
});
