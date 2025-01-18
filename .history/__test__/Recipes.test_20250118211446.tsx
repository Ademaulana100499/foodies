import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import RecipesDetail from "@/pages/recipes/[id]";
import { GetServerSidePropsContext } from "next";
import { FoodDetail } from "../../types/Recipes.interface";

// Mocking axios globally
jest.mock("axios");

// Mocking Next.js router globally
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("RecipesDetail Page", () => {
  const foodData = {
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

  // Set up environment variables before all tests
  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    process.env.NEXT_PUBLIC_API_KEY = "test-api-key";
  });

  // Reset mocks after each test to avoid test pollution
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and render recipe details correctly", async () => {
    // Mocking axios.get to simulate an API call
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: foodData } });

    // Mocking useRouter
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Simulate getServerSideProps data
    const context: GetServerSidePropsContext = {
      params: { id: "1" },
      query: {},
      req: {} as any,
      res: {} as any,
      resolvedUrl: "",
      locale: "",
      locales: [],
      defaultLocale: "",
    };

    // Fetch the props with SSR
    const { props } = await RecipesDetail.getServerSideProps(context);

    // Render the page with SSR data
    render(<RecipesDetail food={props.food} />);

    // Assert that the data is correctly rendered
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
    // Mocking axios.get to simulate an API call
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: foodData } });

    // Mocking useRouter
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<RecipesDetail food={foodData} />);

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Check if the router push function is called with the correct path
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/recipes"));
  });
});
