import { useEffect, useState } from "react";
import { Food } from "./Food.interface";
import { useRouter } from "next/router";
import { getFoodDetail, getFoods } from "@/services/food";

const useFood = () => {
  const [data, setdata] = useState<Food[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [food, setfood] = useState<Food>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    ingredients: [],
    price: null,
    priceDiscount: null,
    rating: 4.9,
    totalLikes: 5,
  });

  const router = useRouter();

  const getData = async () => {
    setisLoading(true);
    const response = await getFoods();
    setdata(response.data.data);
    setisLoading(false);
  };

  const getDetail = async () => {
    setisLoading(true);
    const response = await getFoodDetail(router.query.id as string);
    setfood(response.data.data);
    setisLoading(false);
  };

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (router.query.id) getDetail();
  }, [router.query.id]);

  return {
    data,
    isLoading,
    handleRedirect,
    getDetail,
    food,
  };
};

export default useFood;
