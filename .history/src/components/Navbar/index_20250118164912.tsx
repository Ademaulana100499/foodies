// Navbar.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { createMockRouter } from "../../../test/utils"; // Utility untuk mock router
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar Component", () => {
  const mockRouter = createMockRouter();

  beforeEach(() => {
    // Reset mock sebelum setiap tes
    mockRouter.push = jest.fn();
  });

  test("renders navigation links correctly", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan semua menu navigasi ditampilkan
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Recipes")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("displays 'Login' button when token is not present", () => {
    document.cookie = "token=; path=/"; // Simulasi token kosong

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan tombol 'Login' muncul jika token tidak ada
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("displays 'Logout' button when token is present", () => {
    document.cookie = "token=valid_token; path=/"; // Simulasi token valid

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan tombol 'Logout' muncul jika token ada
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to login page when 'Login' button is clicked", () => {
    document.cookie = "token=; path=/"; // Simulasi token kosong

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Memastikan navigasi menuju halaman login
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("logs out and redirects to login page when 'Logout' button is clicked", () => {
    document.cookie = "token=valid_token; path=/"; // Simulasi token valid

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Memastikan logout dan menghapus cookie token
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );

    // Memastikan navigasi menuju halaman login
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("renders mobile menu button correctly", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const mobileMenuButton = screen.getByRole("button");
    expect(mobileMenuButton).toBeInTheDocument();
    fireEvent.click(mobileMenuButton);

    // Memastikan mobile menu berfungsi (tombol menu di klik)
    // Uji lebih lanjut dapat dilakukan jika Anda menambahkan logika untuk menu mobile
  });
});
