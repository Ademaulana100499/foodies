import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recipes, { getServerSideProps } from "@/pages/recipes";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "../utils/createMockRouter";
import axios from "axios";

// Mock axios module
jest.mock("axios");

describe("Recipes Page", () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = createMockRouter("/recipes");
  });

  test("renders recipe items", async () => {
    const mockData = {
      data: [
        {
          id: "1",
          name: "Salad",
          imageUrl: "/salad.jpg",
          description: "A healthy green salad",
        },
      ],
    };

    // Mocking axios.get
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(
      <RouterContext.Provider value={mockRouter}>
        <Recipes data={mockData.data} />
      </RouterContext.Provider>
    );

    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByAltText("Salad")).toHaveAttribute("src", "/salad.jpg");
    expect(screen.getByText("A healthy green salad")).toBeInTheDocument();
  });

  test("navigates to recipe details on click", async () => {
    const mockData = { data: [{ id: "1", name: "Salad" }] };
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

  test("displays loading state when fetching", async () => {
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
    const mockData = { data: [{ id: "1", name: "Salad" }] };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const response = await getServerSideProps();

    expect(response).toEqual({ props: { data: mockData.data } });
  });

  test("handles fetch error", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const response = await getServerSideProps();

    expect(response).toEqual({ props: { data: [] } });
  });
});
