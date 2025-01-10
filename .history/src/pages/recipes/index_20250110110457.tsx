import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FoodArr, Food } from "./Recipes.interface";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function getServerSideProps() {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await axios.get(`${apiUrl}/foods`, {
    headers: {
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
    },
  });
  return { props: { data: res.data.data || [] } };
}

const Recipes = ({ data }: FoodArr) => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Explore Our Delicious Recipes
        </h1>
        <p className="text-lg text-center text-gray-700 mb-8">
          Discover a variety of tasty dishes to try out. Click on a recipe to
          learn more!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item: Food) => {
            return (
              <div
                key={item.id}
                onClick={() => router.push(`/recipes/${item.id}`)}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
