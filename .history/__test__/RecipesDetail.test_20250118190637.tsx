import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipesDetail, { getServerSideProps } from "@/pages/recipes/[id]";
import { FoodDetail } from "../../types/Recipes.interface";
import axios from "axios";
import { useRouter } from "next/router";
import { Router } from "next/router";
import nextRouterMock from "next-router-mock";

// Mock axios
jest.mock("axios");

describe("RecipesDetail Page", () => {
  beforeEach(() => {
    nextRouterMock.setCurrentUrl("/recipes/1");
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

    render(<RecipesDetail food={mockFood.food} />);

    // Check if food name is rendered
    expect(screen.getByText("Salad")).toBeInTheDocument();

    // Check if food description is rendered
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();

    // Check if ingredients are listed
    expect(screen.getByText("Lettuce")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("Cucumber")).toBeInTheDocument();

    // Check if the rating is rendered correctly
    expect(screen.getByText("★★★★☆")).toBeInTheDocument();

    // Check if total likes is rendered
    expect(screen.getByText("(100 likes)")).toBeInTheDocument();

    // Check if image is rendered
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

    render(<RecipesDetail food={mockFood.food} />);

    // Simulate clicking the "Back to Recipes List" button
    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Ensure the router navigates to the recipes list page
    expect(nextRouterMock.push).toHaveBeenCalledWith("/recipes");
  });

  test("displays loading state when data is fetching", async () => {
    // Mock axios to simulate a loading state
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<RecipesDetail food={null as any} />);

    // You can check for loading indicators here, for example:
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

    const context = { params: { id: "1" } };

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        food: mockFood,
      },
    });
  });

  test("handles error while fetching food data", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const context = { params: { id: "1" } };

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        food: null,
      },
    });
  });
});
