import { Food } from "./Food.interface";
import useFood from "./useFood";

const FoodPage = () => {
  const { data, isLoading, handleRedirect } = useFood();

  return (
    <div className="min-h-screen bg-orange-50">
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">
          Our Delicious Food List
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.map((item: Food) => (
              <div
                onClick={() => handleRedirect(`/food/${item.id}`)}
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 duration-300 transition-shadow duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-orange-600">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodPage;
