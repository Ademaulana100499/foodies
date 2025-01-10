import React from 'react'

const Home = () => {
  return (
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
  )
}

export default Home