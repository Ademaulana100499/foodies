import { render, screen, fireEvent } from "@testing-library/react";
import RecipesDetail from "@/pages/recipes/[id]";
import { FoodDetail } from "@/types/Recipes.interface";
import { useRouter } from "next/router";
import axios from "axios";
import { getServerSideProps } from "@/pages/recipes/[id]";
import { GetServerSidePropsContext } from "next";
import { ServerResponse } from "http";

// Mocking the next/image component
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

  it("renders the recipe details correctly", () => {
    render(<RecipesDetail food={mockFood} />);

    // Check if the recipe name is displayed
    expect(screen.getByText(mockFood.name)).toBeInTheDocument();
    // Check if the description is displayed
    expect(screen.getByText(mockFood.description)).toBeInTheDocument();
    // Check if the ingredients are listed
    mockFood.ingredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });
  });

  it("navigates back to the recipes list when the back button is clicked", async () => {
    render(<RecipesDetail food={mockFood} />);

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Check if the router push function is called
    expect(useRouter().push).toHaveBeenCalledWith("/recipes");
  });

  describe("getServerSideProps", () => {
    it("fetches food data and returns it as props", async () => {
      // Mock axios response
      (axios.get as jest.Mock).mockResolvedValue({
        data: { data: mockFood },
      });

      // Mock context.params and req
      const context: GetServerSidePropsContext = {
        params: { id: "1" },
        query: {},
        req: { cookies: {} } as any, // Mocking req with the expected shape
        res: {} as ServerResponse, // Mocking res with the correct type
        resolvedUrl: "",
        locale: "",
        defaultLocale: "",
        locales: [],
      };

      // Calling getServerSideProps with mock context
      const { props } = await getServerSideProps(context);

      // Ensuring the returned food data matches the mock food data
      expect(props.food).toEqual(mockFood);

      // Ensuring axios was called with the correct URL
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/foods/1`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            apiKey: process.env.NEXT_PUBLIC_API_KEY,
          }),
        })
      );
    });
  });
});
