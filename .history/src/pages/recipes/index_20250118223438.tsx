import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import { createMockRouter } from "../utils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import axios from "axios";
import "@testing-library/jest-dom";

// Mocking axios
jest.mock("axios");

describe("Recipes Page", () => {
  const mockRouter = createMockRouter("/recipes");

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: "Spaghetti Carbonara",
            imageUrl: "https://example.com/spaghetti.jpg",
          },
        ],
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
        <Recipes
          data={[
            {
              id: 1,
              name: "Spaghetti Carbonara",
              imageUrl: "https://example.com/spaghetti.jpg",
            },
          ]}
        />
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
        <Recipes
          data={[
            {
              id: 1,
              name: "Spaghetti Carbonara",
              imageUrl: "https://example.com/spaghetti.jpg",
            },
          ]}
        />
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
        data: [
          {
            id: 1,
            name: "Spaghetti Carbonara",
            imageUrl: "https://example.com/spaghetti.jpg",
          },
        ],
      },
    });
  });
});
