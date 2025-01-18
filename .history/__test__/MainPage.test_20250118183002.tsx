import { render, screen, fireEvent } from "@testing-library/react";
import MainPage from "@/pages/Main";
import "@testing-library/jest-dom";

describe("MainPage", () => {
  test("render home section correctly", () => {
    render(<MainPage />);
    expect(screen.getByText(/Welcome to Foodies/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Discover delicious recipes and culinary inspiration./i)
    ).toBeInTheDocument();
    const exploreButton = screen.getByText(/Explore Recipes/i);
    expect(exploreButton).toHaveClass("bg-orange-500");
  });

  test("render about section correctly", () => {
    render(<MainPage />);
    expect(screen.getByText(/About Foodies/i)).toBeInTheDocument();
    expect(
      screen.getByText(/At Foodies, we believe food brings people together./i)
    ).toBeInTheDocument();
  });

  test("render recipe cards correctly", () => {
    render(<MainPage />);
    const recipeCards = [
      { text: /Healthy Meals/i, alt: /Salad/i, imgSrc: "/assets/salad.jpg" },
      { text: /Sweet Treats/i, alt: /Dessert/i, imgSrc: "/assets/dessert.jpg" },
      {
        text: /Italian Delights/i,
        alt: /Pasta/i,
        imgSrc: "/assets/pasta.webp",
      },
    ];
    recipeCards.forEach(({ text, alt, imgSrc }) => {
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(screen.getByAltText(alt)).toHaveAttribute("src", imgSrc);
    });
  });

  test("render contact form correctly", () => {
    render(<MainPage />);
    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Message/i)).toBeInTheDocument();
    const sendMessageButton = screen.getByText(/Send Message/i);
    expect(sendMessageButton).toHaveClass("bg-orange-500");
  });

  test("hover effect on button", () => {
    render(<MainPage />);
    const exploreButton = screen.getByText(/Explore Recipes/i);
    fireEvent.mouseOver(exploreButton);
    expect(exploreButton).toHaveClass("hover:bg-orange-600");
  });
});
