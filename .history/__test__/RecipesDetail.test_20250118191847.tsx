import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipesDetail, { getServerSideProps } from "@/pages/recipes/[id]";
import { FoodDetail } from "@/types/Recipes.interface";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";

// Mock axios
jest.mock("axios");

describe("RecipesDetail Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders food detail correctly", async () => {
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

    // Check if food name is rendered
    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();
    expect(screen.getByText("Lettuce")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("Cucumber")).toBeInTheDocument();
    expect(screen.getByText("★★★★☆")).toBeInTheDocument();
    expect(screen.getByText("(100 likes)")).toBeInTheDocument();
    const image = screen.getByAltText("Salad");
    expect(image).toHaveAttribute("src", "/path/to/salad.jpg");
  });

  test("navigates back to recipes list when 'Back to Recipes List' button is clicked", async () => {
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

    // Simulate clicking the "Back to Recipes List" button
    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Ensure the router navigates to the recipes list page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/recipes");
    });
  });

  test("displays loading state when data is fetching", async () => {
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <RouterContext.Provider value={mockRouter}>
        <RecipesDetail food={null as any} />
      </RouterContext.Provider>
    );

    // Check for loading state (for example: spinner, "Loading..." text)
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("fetches food data successfully", async () => {
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

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood },
    });

    // Create a mock context with required properties
    const context: GetServerSidePropsContext = {
      params: { id: "1" },
      req: {} as any, // Mocked request object
      res: {} as any, // Mocked response object
      query: {}, // Empty query object
      resolvedUrl: "", // Empty resolved URL
    };

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        food: mockFood,
      },
    });
  });

  test("handles error while fetching food data", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    // Create a mock context with required properties
    const context: GetServerSidePropsContext = {
      params: { id: "1" },
      req: {} as any,
      res: {} as any,
      query: {},
      resolvedUrl: "",
    };

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        food: null,
      },
    });
  });
});
