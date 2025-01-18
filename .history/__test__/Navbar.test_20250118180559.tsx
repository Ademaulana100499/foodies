import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Navbar", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
    document.cookie = mockRouter.query.token ? "token=some-token" : "";
  });

  test("renders navbar and Login/Logout button", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Foodies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates on button click", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByText("Login"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");

    document.cookie = "token=some-token";
    fireEvent.click(screen.getByText("Logout"));
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
    expect(document.cookie).toBe(
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    );
  });

  test("toggles mobile menu", () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Navbar />
      </RouterContext.Provider>
    );
    fireEvent.click(screen.getByRole("button"));
  });
});
