import { render, screen, fireEvent } from "@testing-library/react";
import MainPage from "@/pages/Main";
import "@testing-library/jest-dom";

test("render home section correctly", () => {
  render(<MainPage />);
  expect(screen.getByText(/Welcome to Foodies/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Discover delicious recipes and culinary inspiration./i)
  ).toBeInTheDocument();
  const exploreButton = screen.getByText(/Explore Recipes/i);
  expect(exploreButton).toHaveClass("bg-orange-500");

  expect(screen.getByText(/About Foodies/i)).toBeInTheDocument();
  expect(
    screen.getByText(/At Foodies, we believe food brings people together./i)
  ).toBeInTheDocument();
});
