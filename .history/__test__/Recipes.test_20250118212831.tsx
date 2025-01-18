import { render, screen, fireEvent } from "@testing-library/react";
import Recipes from "@/pages/recipes"; // Gantilah path sesuai dengan struktur Anda
import { useRouter } from "next/router";
import axios from "axios";

// Mock axios dan useRouter
jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Recipes Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    // Mock data untuk resep
    axios.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: "Recipe 1",
            imageUrl: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            name: "Recipe 2",
            imageUrl: "https://via.placeholder.com/150",
          },
        ],
      },
    });
  });

  test("renders the Recipes component with data", async () => {
    render(<Recipes data={[]} />);

    // Pastikan elemen dengan teks yang diinginkan dirender
    expect(
      await screen.findByText(/Explore Our Delicious Recipes/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Discover a variety of tasty dishes to try out/i)
    ).toBeInTheDocument();

    // Pastikan ada dua resep yang dirender
    expect(await screen.findByText(/Recipe 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Recipe 2/i)).toBeInTheDocument();
  });

  test("clicking on a recipe redirects to the correct page", async () => {
    render(<Recipes data={[]} />);

    // Cari elemen dan klik
    const recipeItem = await screen.findByText(/Recipe 1/i);
    fireEvent.click(recipeItem);

    // Pastikan router.push dipanggil dengan benar
    expect(mockPush).toHaveBeenCalledWith("/recipes/1");
  });

  test("handles error gracefully when API call fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API call failed"));

    render(<Recipes data={[]} />);

    // Periksa apakah tidak ada resep yang ditampilkan
    expect(
      await screen.findByText(/Explore Our Delicious Recipes/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Recipe 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recipe 2/i)).not.toBeInTheDocument();
  });
});
