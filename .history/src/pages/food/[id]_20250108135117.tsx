import useFood from "./useFood";

const FoodDetail = () => {
  const { food, handleRedirect } = useFood();

  return (
    <div>
      <p onClick={() => handleRedirect("/food")}>back to list</p>
      Food Detail:
      <h1>{food.name}</h1>
      <p>{food.description}</p>
    </div>
  );
};

export default FoodDetail;
