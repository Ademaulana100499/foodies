import useFood from "./useFood";

const FoodDetail = () => {
  const { food, handleRedirect } = useFood();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1
            className="text-xl font-bold cursor-pointer hover:underline"
            onClick={() => handleRedirect("/food")}
          >
            Back to Food List
          </h1>
        </div>
      </header>

      {/* Detail Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-8">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              {food.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
              pariatur ratione tenetur consequuntur! Amet ab consectetur non est
              dolorem vel ducimus quasi ex fuga, tempora nulla, modi excepturi
              architecto quis.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-lg font-semibold text-gray-700">Rating:</p>
              <span className="text-lg text-orange-500 font-bold">
                {food.rating}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-lg font-semibold text-gray-700">
                Total Likes:
              </p>
              <span className="text-lg text-green-500 font-bold">
                {food.totalLikes}
              </span>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              <p className="text-lg font-semibold text-gray-700">Price:</p>
              <span className="text-lg line-through text-red-500">
                {food.price}
              </span>
              <span className="text-2xl text-orange-600 font-bold">
                {food.priceDiscount}
              </span>
            </div>
            <button
              onClick={() => handleRedirect("/food")}
              className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Back to List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodDetail;
