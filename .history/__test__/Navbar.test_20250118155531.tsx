import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    document.cookie = "";
  });

  test("Navbar render dengan benar", () => {
    render(<Navbar />);
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Recipes")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("Menampilkan tombol Login jika belum ada token", () => {
    render(<Navbar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("Menampilkan tombol Logout jika ada token", () => {
    document.cookie = "token=mocked_token";
    render(<Navbar />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("Navigasi ke /login saat tombol Login diklik", () => {
    render(<Navbar />);
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("Menghapus token saat Logout dan kembali ke login", () => {
    document.cookie = "token=mocked_token";
    render(<Navbar />);
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(document.cookie).toBe("");
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
