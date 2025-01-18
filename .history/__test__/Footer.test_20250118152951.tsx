import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  test("Menampilkan teks hak cipta dengan benar", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 Foodies. All rights reserved./i)
    ).toBeInTheDocument();
  });

  test("Memiliki background berwarna orange", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass("bg-orange-500");
  });
});
