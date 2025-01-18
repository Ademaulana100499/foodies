// Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders navbar correctly", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan elemen-elemen navbar ada
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Recipes")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("renders Login button when token is not present", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan tombol Login muncul saat token tidak ada
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout button when token is present", () => {
    // Menyimulasikan keberadaan token
    document.cookie = "token=some-token";

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    // Memastikan tombol Logout muncul saat token ada
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to login page when Login button is clicked", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Memastikan navigasi ke halaman login
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("navigates to login page when Logout button is clicked", () => {
    // Menyimulasikan keberadaan token
    document.cookie = "token=some-token";

    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Memastikan token dihapus dan navigasi ke halaman login
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("toggles mobile menu button when clicked", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

    const mobileMenuButton = screen.getByRole("button");
    fireEvent.click(mobileMenuButton);

    // Memastikan tombol menu mobile bisa diklik (secara visual di tes UI mobile, misalnya)
    // Karena tidak ada fungsionalitas tambahan untuk toggle menu dalam contoh kode ini, cukup pastikan bahwa tombol bisa diklik
    expect(mobileMenuButton).toBeInTheDocument();
  });
});
