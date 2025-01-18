import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { getServerSideProps } from "@/pages/recipes/[id]"; // Sesuaikan dengan path file yang benar

// Mock axios
jest.mock("axios");

describe("getServerSideProps", () => {
  it("fetches food data and returns it as props", async () => {
    // Data mock yang akan dikembalikan oleh axios
    const mockFood = {
      id: "1",
      name: "Spaghetti Bolognese",
      description: "A classic Italian pasta dish with rich meat sauce.",
      imageUrl: "https://example.com/spaghetti.jpg",
      ingredients: [
        "Spaghetti",
        "Tomato Sauce",
        "Ground Beef",
        "Garlic",
        "Onion",
        "Olive Oil",
      ],
      price: 10,
      priceDiscount: 8,
      rating: 4.5,
      totalLikes: 150,
    };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockFood },
    });

    // Mock context.params
    const context: GetServerSidePropsContext = {
      params: { id: "1" },
      query: {},
      req: {},
      res: {},
      resolvedUrl: "",
      locale: "",
      defaultLocale: "",
      locales: [],
    };

    // Memanggil getServerSideProps dengan context mock
    const { props } = await getServerSideProps(context);

    // Memastikan data yang dikembalikan oleh getServerSideProps sesuai dengan yang diharapkan
    expect(props.food).toEqual(mockFood);

    // Memastikan axios telah dipanggil dengan URL yang tepat
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/foods/1`,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
        }),
      })
    );
  });
});
