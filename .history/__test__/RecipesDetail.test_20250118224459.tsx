import { render, screen, fireEvent } from "@testing-library/react";
import RecipesDetail from "@/pages/recipes/[id]";
import { FoodDetail } from "../../types/Recipes.interface";
import { useRouter } from "next/router";
import axios from "axios";

// Mocking the useRouter hook
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mocking axios
jest.mock("axios");

describe("RecipesDetail", () => {
  const mockFood: FoodDetail["food"] = {
    id: "1",
    name: "Spaghetti Bolognese",
    description: "A classic Italian pasta dish with rich meat sauce.",
    imageUrl: "https://example.com/spaghetti.jpg",
    ingredients: [
      "Spaghetti",
      "Tomato Sauce",
      "Ground Beef",
      "Garlic",
      "Onion",
      "Olive Oil",
    ],
    price: 10,
    priceDiscount: 8,
    rating: 4.5,
    totalLikes: 150,
  };

  beforeEach(() => {
    // Resetting the router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    // Mocking axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockFood },
    });
  });

  it("renders food details correctly", async () => {
    render(<RecipesDetail food={mockFood} />);

    // Check if the food name is displayed
    expect(screen.getByText(mockFood.name)).toBeInTheDocument();

    // Check if the food description is displayed
    expect(screen.getByText(mockFood.description)).toBeInTheDocument();

    // Check if the image is displayed
    const image = screen.getByAltText(mockFood.name) as HTMLImageElement;
    expect(image).toHaveAttribute("src", mockFood.imageUrl);

    // Check if ingredients are listed
    mockFood.ingredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });

    // Check if the rating stars are correctly displayed
    expect(screen.getByText("★★★★☆")).toBeInTheDocument();

    // Check if likes count is displayed
    expect(
      screen.getByText(`(${mockFood.totalLikes} likes)`)
    ).toBeInTheDocument();

    // Check if the price and discounted price are shown correctly
    expect(screen.getByText(`$${mockFood.priceDiscount}`)).toBeInTheDocument();
    expect(screen.getByText(`$${mockFood.price}`)).toBeInTheDocument();
  });

  it("navigates back to the recipes list when the back button is clicked", async () => {
    render(<RecipesDetail food={mockFood} />);

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Check if the router push function is called
    expect(useRouter().push).toHaveBeenCalledWith("/recipes");
  });
});
