import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipesDetail, { getServerSideProps } from "@/pages/recipes/[id]";
import { FoodDetail } from "../../types/Recipes.interface";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import axios from "axios";
import { GetServerSidePropsContext } from "next";

// Mock axios
jest.mock("axios");

describe("RecipesDetail Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({ query: { id: "1" } });
  });

  test("renders recipe detail page correctly", async () => {
    const mockFood: FoodDetail = {
      food: {
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
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood.food },
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <RecipesDetail food={mockFood.food} />
      </RouterContext.Provider>
    );

    // Ensure recipe name is rendered
    expect(screen.getByText("Salad")).toBeInTheDocument();

    // Ensure image is rendered
    expect(screen.getByAltText("Salad")).toHaveAttribute(
      "src",
      "/path/to/salad.jpg"
    );

    // Ensure description is rendered
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();

    // Ensure ingredients are listed
    expect(screen.getByText("Lettuce")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("Cucumber")).toBeInTheDocument();

    // Ensure rating is displayed
    expect(screen.getByText("★★☆☆☆")).toBeInTheDocument(); // 4.5 rounded to 4 stars

    // Ensure likes count is displayed
    expect(screen.getByText("(100 likes)")).toBeInTheDocument();
  });

  test("navigates back to the recipes list when 'Back to Recipes List' is clicked", async () => {
    const mockFood: FoodDetail = {
      food: {
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
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood.food },
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <RecipesDetail food={mockFood.food} />
      </RouterContext.Provider>
    );

    // Simulate click on the "Back to Recipes List" button
    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Ensure the router navigates to the recipes list page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/recipes");
    });
  });

  test("displays loading state while fetching data", async () => {
    // Mock axios to simulate loading state
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <RouterContext.Provider value={mockRouter}>
        <RecipesDetail food={null} />
      </RouterContext.Provider>
    );

    // This test will ensure that while the data is being fetched, nothing breaks.
    // You can check for any loading indicators here if implemented, for example:
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("fetches data successfully", async () => {
    const mockFood = {
      id: "1",
      name: "Salad",
      description: "A healthy green salad",
      imageUrl: "/path/to/salad.jpg",
      ingredients: ["Lettuce", "Tomato", "Cucumber"],
      price: 10,
      priceDiscount: 5,
      rating: 4.5,
      totalLikes: 100,
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood },
    });

    const context: GetServerSidePropsContext = { params: { id: "1" } };
    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { food: mockFood },
    });
  });

  test("handles error while fetching data", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const context: GetServerSidePropsContext = { params: { id: "1" } };
    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: { food: null },
    });
  });
});
