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
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  <button
                    onClick={() => handleRedirect(`/food/${item.id}`)}
                    className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                  >
                    View Details
                  </button>
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
