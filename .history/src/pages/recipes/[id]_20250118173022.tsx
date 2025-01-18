import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FoodDetail } from "../../types/Recipes.interface";
import { GetServerSidePropsContext } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Authorization from "@/components/Layout/Authorization";
import Image from "next/image";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL;
  const params = context.params ?? { id: "" };
  const res = await axios.get(`${apiUrl}/foods/${params.id}`, {
    headers: {
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
    },
  });
  return { props: { food: res.data.data } };
}

const RecipesDetail = ({ food }: FoodDetail) => {
  const router = useRouter();
  const dummySteps = [
    "Prepare all ingredients.",
    "Heat the pan and add oil.",
    "Cook the main ingredient until golden brown.",
    "Add seasoning and cook for another 5 minutes.",
    "Serve hot and enjoy your meal!",
  ];

  return (
    <div>
      <Authorization>
        <Navbar />
        <div className="bg-gray-100 min-h-screen">
          <div className="max-w-5xl mt-14 mx-auto px-4 py-8">
            <button
              onClick={() => router.push("/recipes")}
              className="text-orange-500 font-semibold hover:underline mb-4">
              Back to Recipes List
            </button>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <Image
                src={food.imageUrl}
                alt={food.name}
                width={800}
                height={384}
                className="w-full h-96 object-cover rounded-t-lg"
              />

              <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                  {food.name}
                </h1>
                <p className="text-lg text-gray-600 mb-6">{food.description}</p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">
                      {"★".repeat(Math.round(food.rating))}
                      {"☆".repeat(5 - Math.round(food.rating))}
                    </span>
                    <span className="text-gray-700">
                      ({food.totalLikes} likes)
                    </span>
                  </div>
                </div>
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
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Steps
                  </h3>
                  <ol className="list-decimal list-inside text-gray-700">
                    {dummySteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Authorization>
    </div>
  );
};

export default RecipesDetail;
