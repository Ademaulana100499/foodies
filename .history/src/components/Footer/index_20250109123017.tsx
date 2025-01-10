import React from "react";

const Footer = () => {
  return (
    <footer className="bg-orange-500 text-white py-6">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; 2025 Foodies Recipes. All rights reserved.</p>
        <p>
          Contact us at{" "}
          <a href="mailto:contact@foodies.com" className="underline">
            contact@foodies.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
