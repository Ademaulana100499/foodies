import React from "react";
import useFood from "../food/useFood";
import { Food } from "../food/Food.interface";
const MainPage = () => {
    const { data, isLoading} = useFood();
  return (
    <div>
      <section
        id="home"
        style={{ backgroundImage: "url('/assets/food-home.jpg')" }}
        className="bg-cover bg-center h-screen flex items-center justify-center"
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
      <section id="about" className="bg-gray-100 py-16 px-8 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-600">About Foodies</h2>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            At Foodies, we believe food brings people together. Explore our
            collection of recipes from around the world, handpicked to inspire
            your next culinary adventure.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg  max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/cooking-icon.png"
                alt="Cooking Icon"
                className="w-16 h-16"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Discover Recipes
            </h3>
            <p className="mt-2 text-gray-600">
              Find diverse recipes to spice up your kitchen and ignite your
              creativity.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/community-icon.png"
                alt="Community Icon"
                className="w-16 h-16"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Join the Community
            </h3>
            <p className="mt-2 text-gray-600">
              Share your favorite recipes and connect with food enthusiasts
              worldwide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/chef-hat-icon.png"
                alt="Chef Hat Icon"
                className="w-16 h-16"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Become a Chef
            </h3>
            <p className="mt-2 text-gray-600">
              Learn from step-by-step guides and elevate your cooking skills.
            </p>
          </div>
        </div>
      </section>
      <section id="recipes" className="py-16 px-8 md:px-16 bg-white">
        <div className="min-h-screen bg-orange-50">
              <div className="container mx-auto px-6 py-12">
                <h2 className="text-4xl font-bold text-orange-600">
                  Recipes
                </h2>
        
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.map((item: Food) => (
                      <div
                        onClick={() => (`/food/${item.id}`)}
                        key={item.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-500"
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
              </div>
            </div>
      </section>
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
