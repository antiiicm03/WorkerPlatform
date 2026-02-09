import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-gray-300 hover:text-white font-medium transition-colors">
          About Us
        </Link>
        <Link to="/users" className="text-gray-300 hover:text-white font-medium transition-colors">
          For Users
        </Link>
        <Link to="/workers" className="text-gray-300 hover:text-white font-medium transition-colors">
          For Workers
        </Link>
        <Link to="/contact" className="text-gray-300 hover:text-white font-medium transition-colors">
          Contact Us
        </Link>
        <Button type="secondary" btnText="Log In" />
      </nav>

      {/* Hamburger Button - Mobile */}
      <button
        className="md:hidden text-white z-50 p-2 hover:bg-gray-800/50 rounded-lg transition"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {!isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 bg-gray-900/95 backdrop-blur-lg border-l border-gray-700
          transform transition-transform duration-300 ease-in-out z-40
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden
        `}
      >
        <nav className="flex flex-col gap-6 p-8 pt-24">
          <Link
            to="/"
            className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          <Link
            to="/users"
            className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
            onClick={toggleMenu}
          >
            For Users
          </Link>
          <Link
            to="/workers"
            className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
            onClick={toggleMenu}
          >
            For Workers
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
            onClick={toggleMenu}
          >
            Contact Us
          </Link>
          <div className="pt-4">
            <Button type="secondary" btnText="Log In" />
          </div>
        </nav>
      </div>

      
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}