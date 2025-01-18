import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FoodArr, Food } from "../../types/Recipes.interface";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Authorization from "@/components/Layout/Authorization";
import Image from "next/image";

export async function getServerSideProps() {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await axios.get(`${apiUrl}/foods`, {
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
    });
    return { props: { data: res.data.data || [] } };
  } catch (error) {
    console.error("Error fetching food data:", error);
    return { props: { data: [] } };
  }
}

const Recipes = ({ data }: FoodArr) => {
  const router = useRouter();

  return (
    <Authorization>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />

        <div className="max-w-6xl mt-12 mx-auto px-4 py-8">
          <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
            Explore Our Delicious Recipes
          </h1>
          <p className="text-lg text-center text-gray-600 mb-8">
            Discover a variety of tasty dishes to try out. Click on a recipe to
            learn more!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.map((item: Food) => (
              <div
                key={item.id}
                onClick={() => router.push(`/recipes/${item.id}`)}
                className="group bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={800}
                  height={384}
                  className="object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to view the full recipe and discover more details!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </Authorization>
  );
};

export default Recipes;
