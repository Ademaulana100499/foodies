import { render, screen, waitFor } from "@testing-library/react";
import Authorization from "@/components/Authorization"; // Sesuaikan dengan path yang benar
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";

// Mocking dependencies
jest.mock("cookies-next", () => ({
  getCookie: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Authorization Component", () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush, pathname: "/" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test("render children when token exists", () => {
    // Mocking getCookie untuk mengembalikan token yang valid
    (getCookie as jest.Mock).mockReturnValue("valid-token");

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    // Verifying if children are rendered
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirect to login when no token", async () => {
    // Mocking getCookie untuk mengembalikan null (tidak ada token)
    (getCookie as jest.Mock).mockReturnValue(null);

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    // Verifying that router.push is called with "/login" if token is absent
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("does not redirect if already on login page", async () => {
    // Mocking getCookie untuk mengembalikan null dan halaman login
    (getCookie as jest.Mock).mockReturnValue(null);
    mockRouter.pathname = "/login"; // Change router pathname to login page

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    // Verifying that the redirect does not occur
    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
