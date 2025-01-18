import { render, screen, fireEvent } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import axios from "axios";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

describe("Recipes Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter({});
  });

  test("renders the page with recipe data", async () => {
    // Mock data to be returned by axios based on FoodArr type
    const mockData = [
      {
        id: "1",
        name: "Recipe 1",
        description: "Delicious recipe 1",
        imageUrl: "/images/recipe1.jpg",
        ingredients: ["ingredient1", "ingredient2"],
        price: 20,
        priceDiscount: 5,
        rating: 4.5,
        totalLikes: 150,
      },
      {
        id: "2",
        name: "Recipe 2",
        description: "Delicious recipe 2",
        imageUrl: "/images/recipe2.jpg",
        ingredients: ["ingredient3", "ingredient4"],
        price: 15,
        priceDiscount: 3,
        rating: 4.0,
        totalLikes: 100,
      },
    ];

    axios.get.mockResolvedValue({ data: { data: mockData } });

    // Render the component
    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData} />
      </RouterContext.Provider>
    );

    // Check if the page title is rendered
    expect(
      screen.getByText(/Explore Our Delicious Recipes/i)
    ).toBeInTheDocument();

    // Check if the recipes are rendered
    expect(screen.getByText("Recipe 1")).toBeInTheDocument();
    expect(screen.getByText("Recipe 2")).toBeInTheDocument();
    expect(screen.getByAltText("Recipe 1")).toHaveAttribute(
      "src",
      "/images/recipe1.jpg"
    );
    expect(screen.getByAltText("Recipe 2")).toHaveAttribute(
      "src",
      "/images/recipe2.jpg"
    );
  });

  test("clicking on a recipe item redirects to the recipe details page", async () => {
    const mockData = [
      {
        id: "1",
        name: "Recipe 1",
        description: "Delicious recipe 1",
        imageUrl: "/images/recipe1.jpg",
        ingredients: ["ingredient1", "ingredient2"],
        price: 20,
        priceDiscount: 5,
        rating: 4.5,
        totalLikes: 150,
      },
    ];

    axios.get.mockResolvedValue({ data: { data: mockData } });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData} />
      </RouterContext.Provider>
    );

    const recipeItem = screen.getByText("Recipe 1");

    fireEvent.click(recipeItem);

    // Verify the redirect to the recipe detail page
    expect(mockRouter.push).toHaveBeenCalledWith("/recipes/1");
  });

  test("shows empty state when no recipes are available", async () => {
    axios.get.mockResolvedValue({ data: { data: [] } });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );

    expect(
      screen.getByText("Explore Our Delicious Recipes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Discover a variety of tasty dishes to try out.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Recipe 1")).toBeNull();
  });

  test("renders loading state while fetching data", async () => {
    // Simulate a loading state
    axios.get.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );

    // You can add a loading state to be tested here, for example:
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("fetches data successfully", async () => {
    const mockData = {
      data: {
        data: [
          {
            id: "1",
            name: "Recipe 1",
            description: "Description",
            imageUrl: "image.jpg",
            ingredients: ["ingredient"],
            price: 20,
            priceDiscount: 5,
            rating: 4.5,
            totalLikes: 100,
          },
        ],
      },
    };
    axios.get.mockResolvedValue(mockData);

    const result = await getServerSideProps();
    expect(result.props.data).toEqual(mockData.data.data);
  });

  test("handles error and returns empty data", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching data"));

    const result = await getServerSideProps();
    expect(result.props.data).toEqual([]);
  });
});
