import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes from "../pages/recipes"; // Adjust the path as needed
import { FoodArr } from "../../types/Recipes.interface";
import axios from "axios";
import mockAxios from "axios-mock-adapter";
import { useRouter } from "next/router";

// Create a mock router push function
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Recipes Page", () => {
  let mockData: FoodArr;
  let mockPush: jest.Mock;

  beforeEach(() => {
    // Mocking data
    mockData = {
      data: [
        {
          id: "1",
          name: "Pizza",
          description: "Delicious pizza with cheese",
          imageUrl: "https://example.com/pizza.jpg",
          ingredients: ["Cheese", "Tomato", "Dough"],
          price: 10,
          priceDiscount: 8,
          rating: 4.5,
          totalLikes: 100,
        },
        // Add more mock food items here if needed
      ],
    };

    // Mocking the router push function
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Set up axios mock
    const mock = new mockAxios(axios);
    mock.onGet("/foods").reply(200, mockData);
  });

  it("should render the recipes list", async () => {
    render(<Recipes data={mockData.data} />);

    // Check if recipe title and description are displayed
    expect(
      screen.getByText("Explore Our Delicious Recipes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Discover a variety of tasty dishes to try out")
    ).toBeInTheDocument();

    // Wait for image and text rendering
    await waitFor(() => {
      expect(screen.getByAltText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });
  });

  it("should navigate to recipe detail on click", async () => {
    render(<Recipes data={mockData.data} />);

    // Find and click the recipe item
    const pizzaItem = screen.getByText("Pizza");
    fireEvent.click(pizzaItem);

    // Assert that the router push function was called with the correct path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/recipes/1");
    });
  });
});
