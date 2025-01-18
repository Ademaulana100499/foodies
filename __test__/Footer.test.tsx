import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  test("renders copyright text and orange background", () => {
    const { container } = render(<Footer />);
    expect(
      screen.getByText(/© 2025 Foodies. All rights reserved./i)
    ).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-orange-500");
  });
});
