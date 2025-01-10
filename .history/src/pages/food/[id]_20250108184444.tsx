import useFood from "./useFood";

const FoodDetail = () => {
  const { food, handleRedirect } = useFood();

  return (
    <div>
      <p onClick={() => handleRedirect("/food")}>back to list</p>
      Food Detail:
      <img src={food.imageUrl} alt="" />
      <h1>{food.name}</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta pariatur
        ratione tenetur consequuntur! Amet ab consectetur non est dolorem vel
        ducimus quasi ex fuga, tempora nulla, modi excepturi architecto quis.
      </p>
      <p>{food.rating}</p>
      <p>{food.totalLikes}</p>
      <p>{food.price}</p>
      <p>{food.priceDiscount}</p>
    </div>
  );
};

export default FoodDetail;
