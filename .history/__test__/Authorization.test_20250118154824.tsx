import { render, screen, waitFor } from "@testing-library/react";
import Authorization from "@/components/Layout/Authorization";
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
    (getCookie as jest.Mock).mockReturnValue("valid-token");

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirect to login when no token", async () => {
    (getCookie as jest.Mock).mockReturnValue(null);

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("does not redirect if already on login page", async () => {
    (getCookie as jest.Mock).mockReturnValue(null);
    mockRouter.pathname = "/login";

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );
    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
