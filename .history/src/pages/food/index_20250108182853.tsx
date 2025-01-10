import { Food } from "./Food.interface";
import useFood from "./useFood";

const FoodPage = () => {
  const { data, isLoading, handleRedirect } = useFood();

  return (
    <div>
      Food list page
      {isLoading ? (
        <p>loading</p>
      ) : (
        <ul>
          {data.map((item: Food) => {
            return (
              <li onClick={() => handleRedirect(`/food/${item.id}`)}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <img src={item.imageUrl} alt="" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FoodPage;
