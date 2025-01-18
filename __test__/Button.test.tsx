import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button Component", () => {
  test("renders button with correct label", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
