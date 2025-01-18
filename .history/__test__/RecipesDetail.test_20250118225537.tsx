import { render, screen, fireEvent } from "@testing-library/react";
import RecipesDetail from "@/pages/recipes/[id]";
import { FoodDetail } from "@/types/Recipes.interface";
import { useRouter } from "next/router";
import axios from "axios";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));
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

  it("navigates back to the recipes list when the back button is clicked", async () => {
    render(<RecipesDetail food={mockFood} />);

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Check if the router push function is called
    expect(useRouter().push).toHaveBeenCalledWith("/recipes");
  });
});
