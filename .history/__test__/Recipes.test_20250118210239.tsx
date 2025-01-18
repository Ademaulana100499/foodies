import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import axios from "axios";
import Recipes from "@/pages/recipes";
import RecipesDetail from "@/pages/recipes/[id]";
import { Food } from "@/types/Recipes.interface";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock axios
jest.mock("axios");

describe("Recipes Page", () => {
  const foodData: Food[] = [
    {
      id: "1",
      name: "Pizza",
      description: "Delicious pizza with cheese and toppings.",
      imageUrl: "https://example.com/pizza.jpg",
      ingredients: ["Flour", "Cheese", "Tomato Sauce", "Olives"],
      price: 10,
      priceDiscount: 8,
      rating: 4,
      totalLikes: 100,
    },
    {
      id: "2",
      name: "Burger",
      description: "Juicy burger with fresh veggies.",
      imageUrl: "https://example.com/burger.jpg",
      ingredients: ["Bun", "Patty", "Lettuce", "Cheese"],
      price: 5,
      priceDiscount: 4,
      rating: 5,
      totalLikes: 150,
    },
  ];

  it("should render a list of recipes", async () => {
    // Mock the API response
    axios.get.mockResolvedValue({ data: { data: foodData } });

    render(<Recipes data={foodData} />);

    // Check if recipes are rendered
    const pizza = await screen.findByText("Pizza");
    const burger = await screen.findByText("Burger");

    expect(pizza).toBeInTheDocument();
    expect(burger).toBeInTheDocument();
  });

  it("should navigate to recipe detail on click", async () => {
    // Mock the API response
    axios.get.mockResolvedValue({ data: { data: foodData } });
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<Recipes data={foodData} />);

    // Simulate clicking on a recipe
    const pizza = await screen.findByText("Pizza");
    fireEvent.click(pizza);

    // Check if navigation function is called
    expect(pushMock).toHaveBeenCalledWith("/recipes/1");
  });
});

describe("RecipesDetail Page", () => {
  const food: Food = {
    id: "1",
    name: "Pizza",
    description: "Delicious pizza with cheese and toppings.",
    imageUrl: "https://example.com/pizza.jpg",
    ingredients: ["Flour", "Cheese", "Tomato Sauce", "Olives"],
    price: 10,
    priceDiscount: 8,
    rating: 4,
    totalLikes: 100,
  };

  it("should render recipe details correctly", async () => {
    axios.get.mockResolvedValue({ data: { data: food } });

    render(<RecipesDetail food={food} />);

    // Check if the recipe details are rendered
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(
      screen.getByText("Delicious pizza with cheese and toppings.")
    ).toBeInTheDocument();
    expect(screen.getByText("Flour")).toBeInTheDocument();
    expect(screen.getByText("Cheese")).toBeInTheDocument();
    expect(screen.getByText("Tomato Sauce")).toBeInTheDocument();
    expect(screen.getByText("Olives")).toBeInTheDocument();
  });

  it("should navigate back to the recipes list", async () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<RecipesDetail food={food} />);

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith("/recipes");
  });
});
