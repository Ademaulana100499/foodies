import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipesDetail, { getServerSideProps } from "@/pages/recipes/[id]";
import { Food } from "@/types/Recipes.interface";
import axios from "axios";
import { FoodDetail } from "@/types/Recipes.interface";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

describe("RecipesDetail Page", () => {
  const mockFood: Food = {
    id: "1",
    name: "Pasta Carbonara",
    description: "A delicious Italian pasta with creamy sauce and bacon.",
    imageUrl: "/images/pasta.jpg",
    ingredients: ["Pasta", "Bacon", "Cream", "Cheese"],
    price: 12.99,
    priceDiscount: 9.99,
    rating: 4.5,
    totalLikes: 120,
  };

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [mockFood] } });
  });

  test("renders food details correctly", async () => {
    render(
      <RouterContext.Provider value={createMockRouter({ query: { id: "1" } })}>
        <RecipesDetail food={mockFood} />
      </RouterContext.Provider>
    );

    // Memastikan nama makanan ada
    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();

    // Memastikan deskripsi ada
    expect(
      screen.getByText("A delicious Italian pasta with creamy sauce and bacon.")
    ).toBeInTheDocument();

    // Memastikan rating ditampilkan
    expect(screen.getByText("★★★★☆")).toBeInTheDocument(); // Rating 4.5 bulatkan jadi 4 bintang penuh

    // Memastikan jumlah likes ada
    expect(screen.getByText("(120 likes)")).toBeInTheDocument();

    // Memastikan bahan-bahan ditampilkan
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Bacon")).toBeInTheDocument();
    expect(screen.getByText("Cream")).toBeInTheDocument();
    expect(screen.getByText("Cheese")).toBeInTheDocument();

    // Memastikan gambar ada
    const image = screen.getByAltText("Pasta Carbonara");
    expect(image).toHaveAttribute("src", "/images/pasta.jpg");

    // Memastikan tombol kembali ada
    const backButton = screen.getByText("Back to Recipes List");
    expect(backButton).toBeInTheDocument();
  });

  test("navigates back to recipes list when button is clicked", async () => {
    render(
      <RouterContext.Provider value={createMockRouter({ query: { id: "1" } })}>
        <RecipesDetail food={mockFood} />
      </RouterContext.Provider>
    );

    const backButton = screen.getByText("Back to Recipes List");
    fireEvent.click(backButton);

    // Memastikan navigasi kembali ke halaman daftar resep
    await waitFor(() => {
      expect(window.location.pathname).toBe("/recipes");
    });
  });

  test("renders loading state while fetching data", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    render(
      <RouterContext.Provider value={createMockRouter({ query: { id: "1" } })}>
        <RecipesDetail food={mockFood} />
      </RouterContext.Provider>
    );

    // Memastikan halaman menunggu data dengan state loading
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("renders error state when food data is not found", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Data not found"));

    render(
      <RouterContext.Provider value={createMockRouter({ query: { id: "1" } })}>
        <RecipesDetail food={mockFood} />
      </RouterContext.Provider>
    );

    // Memastikan error ditampilkan jika data tidak ditemukan
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  // Unit Test untuk getServerSideProps
  test("getServerSideProps fetches data correctly", async () => {
    const context = {
      query: { id: "1" },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: [mockFood] },
    });

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({
      props: {
        food: mockFood,
      },
    });
  });

  test("getServerSideProps handles error correctly", async () => {
    const context = {
      query: { id: "1" },
    };

    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Data not found"));

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({
      props: {
        food: null,
      },
    });
  });
});