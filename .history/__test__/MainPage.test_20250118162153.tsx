import { render, screen, fireEvent } from "@testing-library/react";
import MainPage from "@/pages/Main";
import "@testing-library/jest-dom";

describe("MainPage", () => {
  test("merender bagian home dengan benar", () => {
    render(<MainPage />);

    expect(screen.getByText(/Welcome to Foodies/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Discover delicious recipes and culinary inspiration./i)
    ).toBeInTheDocument();

    const exploreButton = screen.getByText(/Explore Recipes/i);
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveClass("bg-orange-500");
  });

  test("merender bagian about dengan benar", () => {
    render(<MainPage />);

    expect(screen.getByText(/About Foodies/i)).toBeInTheDocument();

    expect(
      screen.getByText(/At Foodies, we believe food brings people together./i)
    ).toBeInTheDocument();
  });

  test("merender kartu resep dengan benar", () => {
    render(<MainPage />);

    const healthyMealsCard = screen.getByText(/Healthy Meals/i);
    expect(healthyMealsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Salad/i)).toHaveAttribute(
      "src",
      "/assets/salad.jpg"
    );

    const sweetTreatsCard = screen.getByText(/Sweet Treats/i);
    expect(sweetTreatsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Dessert/i)).toHaveAttribute(
      "src",
      "/assets/dessert.jpg"
    );

    const italianDelightsCard = screen.getByText(/Italian Delights/i);
    expect(italianDelightsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Pasta/i)).toHaveAttribute(
      "src",
      "/assets/pasta.webp"
    );
  });

  test("merender formulir kontak dengan benar", () => {
    render(<MainPage />);

    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Message/i)).toBeInTheDocument();

    const sendMessageButton = screen.getByText(/Send Message/i);
    expect(sendMessageButton).toBeInTheDocument();
    expect(sendMessageButton).toHaveClass("bg-orange-500");
  });

  test("efek hover tombol berfungsi", () => {
    render(<MainPage />);

    const exploreButton = screen.getByText(/Explore Recipes/i);

    fireEvent.mouseOver(exploreButton);
    expect(exploreButton).toHaveClass("hover:bg-orange-600");
  });
});
