import { useState } from "react";
import Button from "../components/Button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Desktop Navbar - hidden on mobile, visible from md: up */}
            <nav className="hidden md:flex gap-8 items-center">
                <a className="text-white hover:text-gray-200 cursor-pointer">Home</a>
                <a className="text-white hover:text-gray-200 cursor-pointer">About Us</a>
                <a className="text-white hover:text-gray-200 cursor-pointer">For Users</a>
                <a className="text-white hover:text-gray-200 cursor-pointer">For Workers</a>
                <a className="text-white hover:text-gray-200 cursor-pointer">Contact Us</a>
                <Button type="secondary" btnText="Log In" />
            </nav>

            {/* Hamburger Button - visible on mobile, hidden from md: up */}
            <button 
                className="md:hidden text-white z-50"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {!isMenuOpen ? (
                    // Hamburger Icon
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                ) : (
                    // Close Icon
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu - slides in from right */}
            <div className={`
                fixed top-0 right-0 h-full w-64 bg-[#1a1f2e] transform transition-transform duration-300 ease-in-out z-40
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                md:hidden
            `}>
                <nav className="flex flex-col gap-6 p-8 pt-24">
                    <a className="text-white hover:text-gray-200 cursor-pointer text-lg">Home</a>
                    <a className="text-white hover:text-gray-200 cursor-pointer text-lg">About Us</a>
                    <a className="text-white hover:text-gray-200 cursor-pointer text-lg">For Users</a>
                    <a className="text-white hover:text-gray-200 cursor-pointer text-lg">For Workers</a>
                    <a className="text-white hover:text-gray-200 cursor-pointer text-lg">Contact Us</a>
                    <Button type="secondary" btnText="Log In" />
                </nav>
            </div>

            {/* Overlay - darkens background when menu is open */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}