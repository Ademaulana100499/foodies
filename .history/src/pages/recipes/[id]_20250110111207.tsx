import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FoodDetail } from "./Recipes.interface";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "";
  const params = context.params ?? { id: "" };
  const res = await axios.get(`${apiUrl}/foods/${params.id}`, {
    headers: {
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
    },
  });
  return { props: { food: res.data.data } };
}

const RecipesDetail = ({ food }: FoodDetail) => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/recipes")}
          className="text-orange-500 font-semibold hover:underline mb-4">
          Back to Recipes List
        </button>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              {food.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{food.description}</p>

            {/* Price and Rating Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xl font-semibold text-gray-800">
                  ${food.price?.toFixed(2) ?? "Price not available"}
                </span>
                {food.priceDiscount && (
                  <span className="ml-2 text-sm text-red-500 line-through">
                    ${food.priceDiscount?.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">
                  {/* Rating Stars */}
                  {"★".repeat(Math.round(food.rating))}
                  {"☆".repeat(5 - Math.round(food.rating))}
                </span>
                <span className="text-gray-700">({food.totalLikes} likes)</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ingredients
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {food.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesDetail;