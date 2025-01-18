import { render, screen, waitFor } from "@testing-library/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Authorization from "@/components/Layout/Authorization";

jest.mock("cookies-next", () => ({ getCookie: jest.fn() }));
jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Authorization Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders children when token is valid", () => {
    (getCookie as jest.Mock).mockReturnValue("valid-token");

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    screen.getByText("Protected Content");
  });

  test("redirects to login when no token", async () => {
    (getCookie as jest.Mock).mockReturnValue(null);

    render(
      <Authorization>
        <div>Protected Content</div>
      </Authorization>
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });
});