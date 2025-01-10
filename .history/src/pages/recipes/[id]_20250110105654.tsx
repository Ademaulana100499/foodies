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
    <div>
      <p onClick={() => router.push("/foodssr")}>back to list</p>
      Food Detail:
      <h1>{food.name}</h1>
      <p>{food.description}</p>
    </div>
  );
};

export default RecipesDetail;
