import { render, screen, fireEvent } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes/index";
import { useRouter } from "next/router";
import axios from "axios";
import { Food, FoodArr } from "../../types/Recipes.interface";

// Mocking next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

// Mocking axios
jest.mock("axios");

// Mocking useRouter
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Recipes Page", () => {
  const mockData: Food[] = [
    {
      id: "1",
      name: "Spaghetti Bolognese",
      description: "Delicious Italian pasta with a meaty tomato sauce.",
      imageUrl: "https://example.com/spaghetti.jpg",
      ingredients: ["Pasta", "Ground Beef", "Tomato Sauce", "Garlic", "Onion"],
      price: 12.99,
      priceDiscount: 9.99,
      rating: 4.5,
      totalLikes: 100,
    },
    {
      id: "2",
      name: "Chicken Curry",
      description: "A flavorful and spicy chicken curry dish.",
      imageUrl: "https://example.com/chicken_curry.jpg",
      ingredients: [
        "Chicken",
        "Curry Powder",
        "Coconut Milk",
        "Garlic",
        "Ginger",
      ],
      price: 14.99,
      priceDiscount: 11.99,
      rating: 4.7,
      totalLikes: 150,
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    // Mocking axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockData },
    });
  });

  it("renders the list of recipes", async () => {
    render(<Recipes data={mockData} />);

    // Check if recipe names are rendered
    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();
    expect(screen.getByText("Chicken Curry")).toBeInTheDocument();
  });

  it("navigates to recipe detail page when a recipe is clicked", async () => {
    render(<Recipes data={mockData} />);

    // Find the first recipe item and click it
    const recipeItem = screen.getByText("Spaghetti Bolognese");
    fireEvent.click(recipeItem);

    // Check if the router push function was called with the correct path
    expect(useRouter().push).toHaveBeenCalledWith("/recipes/1");
  });

  it("renders the error state when data fetch fails", async () => {
    // Mock axios to simulate an error response
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch data")
    );

    render(<Recipes data={[]} />); // Pass an empty array since fetch failed

    // Ensure that the UI renders correctly even when there is an error (you can display an error message here)
    expect(
      screen.getByText("Explore Our Delicious Recipes")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover a variety of tasty dishes to try out. Click on a recipe to learn more!"
      )
    ).toBeInTheDocument();
  });

  it("renders Navbar and Footer components", () => {
    render(<Recipes data={mockData} />);

    // Check if Navbar and Footer are rendered
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  it("fetches food data and returns it as props", async () => {
    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockData },
    });

    const context: any = { params: { id: "1" } };

    const { props } = await getServerSideProps(context);

    // Ensure the data returned matches the mock data
    expect(props.data).toEqual(mockData);

    // Ensure axios was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/foods`,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
        }),
      })
    );
  });

  it("returns empty data on error", async () => {
    // Mock axios to simulate an error
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch data")
    );

    const context: any = { params: { id: "1" } };

    const { props } = await getServerSideProps(context);

    // Ensure empty data is returned on error
    expect(props.data).toEqual([]);
  });
});
