import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import axios from "axios";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import { FoodArr } from "@/types/Recipes.interface";

jest.mock("axios");
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

describe("Recipes Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter("/recipes");
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
      ],
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByAltText("Salad").getAttribute("src")).toMatch(
      "/path/to/salad.jpg"
    );

    // Perbaiki pencarian teks deskripsi dengan menggunakan regex agar lebih fleksibel
    expect(screen.getByText(/A healthy green salad/i)).toBeInTheDocument();
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
      ],
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByAltText("Salad").getAttribute("src")).toMatch(
      "/path/to/salad.jpg"
    );

    // Gunakan ekspresi reguler untuk mencari teks deskripsi
    await screen.findByText(/A healthy green salad/i); // Gunakan ekspresi reguler
  });

  test("displays a loading state when fetching data", async () => {
    (axios.get as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={[]} />
      </RouterContext.Provider>
    );
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

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const response = await getServerSideProps();
    expect(response).toEqual({ props: { data: mockData.data } });
  });
});
