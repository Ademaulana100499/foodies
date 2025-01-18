import { render } from "@testing-library/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Authorization from "@/components/Layout/Authorization";

// Mock dependencies
jest.mock("cookies-next", () => ({
  getCookie: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

it("should redirect to login if no token, or show content if token is present", () => {
  const pushMock = jest.fn();
  useRouter.mockReturnValue({ push: pushMock });

  // Test no token (redirects)
  getCookie.mockReturnValue(null);
  render(
    <Authorization>
      <div>Content</div>
    </Authorization>
  );
  expect(pushMock).toHaveBeenCalledWith("/login");

  // Test token present (shows content)
  getCookie.mockReturnValue("token");
  render(
    <Authorization>
      <div>Content</div>
    </Authorization>
  );
  expect(screen.getByText("Content")).toBeInTheDocument();
});
