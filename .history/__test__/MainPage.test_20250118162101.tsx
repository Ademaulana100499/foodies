// MainPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MainPage from "./MainPage";
import "@testing-library/jest-dom";

describe("MainPage", () => {
  test("merender bagian home dengan benar", () => {
    render(<MainPage />);

    // Memeriksa apakah teks selamat datang muncul
    expect(screen.getByText(/Welcome to Foodies/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Discover delicious recipes and culinary inspiration./i)
    ).toBeInTheDocument();

    // Memeriksa apakah tombol "Explore Recipes" ada dan memiliki styling yang benar
    const exploreButton = screen.getByText(/Explore Recipes/i);
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveClass("bg-orange-500");
  });

  test("merender bagian about dengan benar", () => {
    render(<MainPage />);

    // Memeriksa apakah heading 'About Foodies' muncul
    expect(screen.getByText(/About Foodies/i)).toBeInTheDocument();

    // Memeriksa apakah teks deskripsi ada
    expect(
      screen.getByText(/At Foodies, we believe food brings people together./i)
    ).toBeInTheDocument();
  });

  test("merender kartu resep dengan benar", () => {
    render(<MainPage />);

    // Memeriksa apakah kartu resep muncul dengan gambar dan judul yang benar
    const healthyMealsCard = screen.getByText(/Healthy Meals/i);
    expect(healthyMealsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Salad/i)).toHaveAttribute(
      "src",
      "/assets/salad.jpg"
    );

    const sweetTreatsCard = screen.getByText(/Sweet Treats/i);
    expect(sweetTreatsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Dessert/i)).toHaveAttribute(
      "src",
      "/assets/dessert.jpg"
    );

    const italianDelightsCard = screen.getByText(/Italian Delights/i);
    expect(italianDelightsCard).toBeInTheDocument();
    expect(screen.getByAltText(/Pasta/i)).toHaveAttribute(
      "src",
      "/assets/pasta.webp"
    );
  });

  test("merender formulir kontak dengan benar", () => {
    render(<MainPage />);

    // Memeriksa apakah formulir kontak muncul
    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your Message/i)).toBeInTheDocument();

    // Memeriksa apakah tombol kirim pesan ada
    const sendMessageButton = screen.getByText(/Send Message/i);
    expect(sendMessageButton).toBeInTheDocument();
    expect(sendMessageButton).toHaveClass("bg-orange-500");
  });

  test("efek hover tombol berfungsi", () => {
    render(<MainPage />);

    const exploreButton = screen.getByText(/Explore Recipes/i);

    // Menguji efek hover dengan meniru event mouseover
    fireEvent.mouseOver(exploreButton);

    // Periksa apakah kelas hover diterapkan (misalnya perubahan warna latar belakang)
    expect(exploreButton).toHaveClass("hover:bg-orange-600");
  });
});
