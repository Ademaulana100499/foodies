import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import { FoodArr } from "@/types/Recipes.interface";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("Recipes Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders recipe items correctly", async () => {
    const mockData: FoodArr = {
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
          name: "Pasta",
          description: "A delicious pasta dish",
          imageUrl: "/path/to/pasta.jpg",
          ingredients: ["Pasta", "Tomato Sauce", "Cheese"],
          price: 15,
          priceDiscount: 8,
          rating: 4.7,
          totalLikes: 200,
        },
        {
          id: "3",
          name: "Pizza",
          description: "Tasty pizza with various toppings",
          imageUrl: "/path/to/pizza.jpg",
          ingredients: ["Dough", "Cheese", "Pepperoni"],
          price: 20,
          priceDiscount: 12,
          rating: 4.8,
          totalLikes: 300,
        },
      ],
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    // Ensure recipe names are rendered
    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();

    // Ensure image for each recipe is rendered
    expect(screen.getByAltText("Salad")).toHaveAttribute(
      "src",
      "/path/to/salad.jpg"
    );
    expect(screen.getByAltText("Pasta")).toHaveAttribute(
      "src",
      "/path/to/pasta.jpg"
    );
    expect(screen.getByAltText("Pizza")).toHaveAttribute(
      "src",
      "/path/to/pizza.jpg"
    );

    // Check if description is rendered
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();
    expect(screen.getByText("A delicious pasta dish")).toBeInTheDocument();
    expect(
      screen.getByText("Tasty pizza with various toppings")
    ).toBeInTheDocument();
  });

  test("navigates to recipe details page when a recipe is clicked", async () => {
    const mockData: FoodArr = {
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
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    // Simulate a click on the recipe
    const recipe = screen.getByText("Salad");
    fireEvent.click(recipe);

    // Check if the router navigates to the correct URL
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/recipes/1");
    });
  });

  test("displays a loading state when fetching data", async () => {
    // Mock axios to simulate loading state
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );

    // This test will ensure that while the data is being fetched, nothing breaks.
    // You can check for any loading indicators here if implemented, for example:
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("fetches data successfully", async () => {
    const mockData: FoodArr = {
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
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const response = await getServerSideProps();

    expect(response).toEqual({
      props: {
        data: mockData.data,
      },
    });
  });

  test("handles error while fetching data", async () => {
    // Simulate an error when fetching data
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const response = await getServerSideProps();

    expect(response).toEqual({
      props: {
        data: [], // In case of error, return empty array
      },
    });
  });
});
