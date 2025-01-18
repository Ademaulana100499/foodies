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

  const renderNavbar = () =>
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );

  test("renders navbar and buttons", () => {
    renderNavbar();
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Recipes")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Logout button when token exists", () => {
    document.cookie = "token=some-token";
    renderNavbar();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates on button click", () => {
    renderNavbar();
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");

    document.cookie = "token=some-token";
    fireEvent.click(screen.getByText("Logout"));
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  test("toggles mobile menu", () => {
    renderNavbar();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
