import { fetchAPI } from "./api";

export const getFoods = async () => {
  return await fetchAPI({
    method: "GET",
    url: "/foods",
  });
};

export const getFoodDetail = async (id: string) => {
  return await fetchAPI({
    method: "GET",
    url: `/foods/${id}`,
  });
};
