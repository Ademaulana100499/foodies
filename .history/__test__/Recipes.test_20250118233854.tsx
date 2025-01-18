import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import axios from "axios";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";

jest.mock("axios");

describe("Recipes Page", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = createMockRouter("/recipes");
  });

  test("renders recipe items correctly", async () => {
    const mockData = {
      data: [
        {
          id: "1",
          name: "Salad",
          description: "A healthy green salad",
          imageUrl: "/path/to/salad.jpg",
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
    expect(screen.getByAltText("Salad")).toHaveAttribute(
      "src",
      "/path/to/salad.jpg"
    );
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();
  });

  test("navigates to recipe details page when a recipe is clicked", async () => {
    const mockData = {
      data: [
        {
          id: "1",
          name: "Salad",
          description: "A healthy green salad",
          imageUrl: "/path/to/salad.jpg",
        },
      ],
    };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    fireEvent.click(screen.getByText("Salad"));
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/recipes/1")
    );
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
    const mockData = {
      data: [
        {
          id: "1",
          name: "Salad",
          description: "A healthy green salad",
          imageUrl: "/path/to/salad.jpg",
        },
      ],
    };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const response = await getServerSideProps();
    expect(response).toEqual({ props: { data: mockData.data } });
  });

  test("handles error while fetching data", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const response = await getServerSideProps();
    expect(response).toEqual({ props: { data: [] } });
  });
});
