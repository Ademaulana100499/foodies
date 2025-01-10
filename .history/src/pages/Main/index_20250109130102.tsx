import React from "react";
import foodHome from "./assets/img/food-home.jpg";
const MainPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        id="home"
        className="bg-[url(`./assets/img/food-home.jpg`)] bg-cover bg-center h-screen flex items-center justify-center"
      >
        <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to Foodies</h1>
          <p className="mt-4 text-lg md:text-xl">
            Discover delicious recipes and culinary inspiration.
          </p>
          <a
            href="#recipes"
            className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Explore Recipes
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-gray-100 py-16 px-8 md:px-16 text-center"
      >
        <h2 className="text-3xl font-bold text-orange-600">About Foodies</h2>
        <p className="mt-4 text-gray-700">
          At Foodies, we believe food brings people together. Explore our
          collection of recipes from around the world, handpicked to inspire
          your next culinary adventure.
        </p>
      </section>

      {/* Recipes Section */}
      <section id="recipes" className="py-16 px-8 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-orange-600">
          Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Recipe Card */}
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-500"
            >
              <img
                src={`https://source.unsplash.com/400x300/?food&sig=${index}`}
                alt="Recipe"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Delicious Recipe {index + 1}
                </h3>
                <p className="text-gray-600 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <a
                  href="#"
                  className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  View Recipe
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-gray-100 py-16 px-8 md:px-16 text-center"
      >
        <h2 className="text-3xl font-bold text-orange-600">Contact Us</h2>
        <p className="mt-4 text-gray-700">
          We'd love to hear from you! Reach out with any questions or
          suggestions.
        </p>
        <form className="mt-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default MainPage;
