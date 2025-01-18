import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import { createMockRouter } from "../utils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import axios from "axios";
import "@testing-library/jest-dom";
import { Food } from "@/types/Recipes.interface";

// Mocking axios
jest.mock("axios");

describe("Recipes Page", () => {
  const mockRouter = createMockRouter("/recipes");

  const mockData: Food[] = [
    {
      id: "1",
      name: "Spaghetti Carbonara",
      description:
        "Delicious Italian pasta with egg, cheese, pancetta, and pepper.",
      imageUrl: "https://example.com/spaghetti.jpg",
      ingredients: ["spaghetti", "egg", "cheese", "pancetta", "pepper"],
      price: 12.99,
      priceDiscount: 10.99,
      rating: 4.5,
      totalLikes: 150,
    },
  ];

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockData,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Recipes page correctly", async () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );

    // Wait for the data to be loaded and the components to be rendered
    await waitFor(() => screen.getByText("Explore Our Delicious Recipes"));

    // Check for title and description
    expect(
      screen.getByText("Explore Our Delicious Recipes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Discover a variety of tasty dishes to try out.")
    ).toBeInTheDocument();
  });

  test("renders recipes from server-side props", async () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData} />
      </RouterContext.Provider>
    );

    await waitFor(() => screen.getByText("Spaghetti Carbonara"));

    // Check if the recipe name is rendered
    expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    // Check if the image is rendered
    const image = screen.getByAltText("Spaghetti Carbonara");
    expect(image).toHaveAttribute("src", "https://example.com/spaghetti.jpg");
  });

  test("clicking on a recipe redirects to the recipe details page", async () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData} />
      </RouterContext.Provider>
    );

    await waitFor(() => screen.getByText("Spaghetti Carbonara"));

    const recipeItem = screen.getByText("Spaghetti Carbonara").closest("div");
    fireEvent.click(recipeItem);

    // Ensure that the router.push is called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith("/recipes/1");
  });

  test("calls getServerSideProps correctly", async () => {
    const context = { params: {} };
    const response = await getServerSideProps(context as any);

    expect(response).toEqual({
      props: {
        data: mockData,
      },
    });
  });
});
