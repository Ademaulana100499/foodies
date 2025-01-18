// Recipes.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Recipes from "@/pages/recipes";
import { Food } from "@/types/Recipes.interface";
import axios from "axios";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("Recipes Page", () => {
  const mockData: Food[] = [
    {
      id: 1,
      name: "Pasta Carbonara",
      imageUrl: "/images/pasta.jpg",
    },
    {
      id: 2,
      name: "Chicken Salad",
      imageUrl: "/images/salad.jpg",
    },
  ];

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockData } });
  });

  test("renders recipes and navigates on click", async () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Recipes data={mockData} />
      </RouterContext.Provider>
    );

    // Memastikan judul utama ada
    expect(
      screen.getByText(/Explore Our Delicious Recipes/i)
    ).toBeInTheDocument();

    // Memastikan deskripsi ada
    expect(
      screen.getByText(/Discover a variety of tasty dishes to try out./i)
    ).toBeInTheDocument();

    // Memeriksa apakah resep pertama ada
    const recipeCard = screen.getByText("Pasta Carbonara");
    expect(recipeCard).toBeInTheDocument();

    // Memeriksa gambar resep pertama
    expect(screen.getByAltText("Pasta Carbonara")).toHaveAttribute(
      "src",
      "/images/pasta.jpg"
    );

    // Memeriksa apakah setiap item dapat di-klik
    fireEvent.click(recipeCard);

    // Memastikan router mengarah ke halaman detail resep yang sesuai
    expect(window.location.pathname).toBe("/recipes/1");
  });

  test("renders no recipes when data is empty", async () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );

    // Memastikan tidak ada kartu resep yang ditampilkan
    expect(screen.queryByText("Pasta Carbonara")).not.toBeInTheDocument();
    expect(screen.queryByText("Chicken Salad")).not.toBeInTheDocument();

    // Memastikan ada pesan atau elemen fallback jika tidak ada data
    expect(screen.getByText(/No recipes found/i)).toBeInTheDocument();
  });
});
