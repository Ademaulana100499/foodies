import { Food } from './Food.interface';
import useFood from './useFood';

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
              <li >
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <img src={item.imageUrl} alt="img" />
              </li>
              <button onClick={() => handleRedirect(`/food/${item.id}`)} >detail</button>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FoodPage;
