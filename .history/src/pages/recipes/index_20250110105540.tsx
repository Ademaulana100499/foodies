import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FoodArr, Food } from "./Recipes.interface";

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

const FoodSSRMethod = ({ data }: FoodArr) => {
  const router = useRouter();
  return (
    <div>
      Food list page
      <ul>
        {data.map((item: Food) => {
          return (
            <li onClick={() => router.push(`/foodssr/${item.id}`)}>
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FoodSSRMethod;
