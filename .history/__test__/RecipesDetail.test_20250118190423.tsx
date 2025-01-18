import { render, screen } from "@testing-library/react";
import { getServerSideProps } from "@/pages/recipes/[id]"; // Import getServerSideProps
import axios from "axios";
import { FoodDetail } from "../../types/Recipes.interface";

// Mock axios
jest.mock("axios");

describe("RecipesDetail", () => {
  // Mock response data
  const mockFood = {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "A delicious pasta with creamy sauce.",
    imageUrl: "https://example.com/spaghetti.jpg",
    ingredients: ["Pasta", "Eggs", "Cheese", "Bacon"],
    price: 12.99,
    priceDiscount: 9.99,
    rating: 4.5,
    totalLikes: 250,
  };

  // Test untuk getServerSideProps
  test("getServerSideProps fetches food details", async () => {
    // Mock implementasi axios
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood },
    });

    // Mock context.params
    const context = {
      params: {
        id: "1", // ID yang sesuai dengan data yang dibutuhkan
      },
    };

    // Memanggil fungsi getServerSideProps dan memeriksa hasilnya
    const response = await getServerSideProps(context);

    // Memeriksa apakah data props yang diterima sesuai dengan yang diharapkan
    expect(response.props.food).toEqual(mockFood);
  });

  // Test untuk tampilan komponen (rendering)
  test("renders food details", async () => {
    // Mock axios untuk mengembalikan data mockFood
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockFood },
    });

    // Render komponen menggunakan props yang sesuai dengan getServerSideProps
    render(<RecipesDetail food={mockFood} />);

    // Memeriksa apakah elemen yang sesuai dengan data mockFood muncul di halaman
    expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    expect(
      screen.getByText("A delicious pasta with creamy sauce.")
    ).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
  });
});
