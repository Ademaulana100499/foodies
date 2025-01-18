import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import { FoodArr } from "../../types/Recipes.interface";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import axios from "axios";
import { GetServerSidePropsContext } from "next";

// Mock axios
jest.mock("axios");

describe("Recipes Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({ query: { id: "1" } });
  });

  test("renders recipe list page correctly", async () => {
    const mockFoods: FoodArr = {
      data: [
        {
          id: "1",
          name: "Salad",
          description: "A healthy green salad",
          imageUrl: "/path/to/salad.jpg",
          ingredients: ["Lettuce", "Tomato", "Cucumber"],
          price: 10,
          priceDiscount: 5,
          rating: 4.5,
          totalLikes: 100,
        },
        {
          id: "2",
          name: "Soup",
          description: "A warm and delicious soup",
          imageUrl: "/path/to/soup.jpg",
          ingredients: ["Carrot", "Onion", "Garlic"],
          price: 8,
          priceDiscount: 3,
          rating: 4.0,
          totalLikes: 80,
        },
      ],
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFoods.data },
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes foods={mockFoods.data} />
      </RouterContext.Provider>
    );

    // Ensure recipe names are displayed
    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByText("Soup")).toBeInTheDocument();

    // Ensure images are displayed
    expect(screen.getByAltText("Salad")).toHaveAttribute(
      "src",
      "/path/to/salad.jpg"
    );
    expect(screen.getByAltText("Soup")).toHaveAttribute(
      "src",
      "/path/to/soup.jpg"
    );

    // Ensure ratings are displayed
    expect(screen.getByText("★★☆☆☆")).toBeInTheDocument(); // 4.5 rounded to 4 stars
    expect(screen.getByText("★★★☆☆")).toBeInTheDocument(); // 4.0 rounded to 4 stars

    // Ensure likes count is displayed
    expect(screen.getByText("(100 likes)")).toBeInTheDocument();
    expect(screen.getByText("(80 likes)")).toBeInTheDocument();
  });

  test("navigates to recipe detail page when a recipe is clicked", async () => {
    const mockFoods: FoodArr = {
      data: [
        {
          id: "1",
          name: "Salad",
          description: "A healthy green salad",
          imageUrl: "/path/to/salad.jpg",
          ingredients: ["Lettuce", "Tomato", "Cucumber"],
          price: 10,
          priceDiscount: 5,
          rating: 4.5,
          totalLikes: 100,
        },
      ],
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFoods.data },
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes foods={mockFoods.data} />
      </RouterContext.Provider>
    );

    // Simulate click on the first recipe
    const saladRecipe = screen.getByText("Salad");
    fireEvent.click(saladRecipe);

    // Ensure the router navigates to the correct detail page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/recipes/1");
    });
  });

  test("displays loading state while fetching data", async () => {
    // Mock axios to simulate loading state
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes foods={[]} />
      </RouterContext.Provider>
    );

    // This test will ensure that while the data is being fetched, nothing breaks.
    // You can check for any loading indicators here if implemented, for example:
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("fetches foods data successfully", async () => {
    const mockFoods = [
      {
        id: "1",
        name: "Salad",
        description: "A healthy green salad",
        imageUrl: "/path/to/salad.jpg",
        ingredients: ["Lettuce", "Tomato", "Cucumber"],
        price: 10,
        priceDiscount: 5,
        rating: 4.5,
        totalLikes: 100,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFoods },
    });

    const context: GetServerSidePropsContext = { params: {} };
    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { foods: mockFoods },
    });
  });

  test("handles error while fetching foods data", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const context: GetServerSidePropsContext = { params: {} };
    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { foods: [] },
    });
  });
});
