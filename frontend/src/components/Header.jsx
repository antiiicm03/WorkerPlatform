import { Link } from "react-router-dom";
import majstorijaLogoMain from "../assets/majstorijaLogoMain.png";
import Navbar from "../components/Navbar";

export default function Header() {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/">
            <img 
              src={majstorijaLogoMain} 
              alt="Majstorija Logo" 
              className="max-w-[150px] md:max-w-[200px] hover:opacity-90 transition-opacity" 
            />
          </Link>
          <Navbar />
        </div>
      </div>
    </header>
  );
}