import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronDown, MessageSquare, ClipboardList } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const isCraftsman = user?.role === 'Craftsman';

  // Inicijali iz AuthContext
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">Početna</Link>
        <Link to="/about" className="text-gray-300 hover:text-white font-medium transition-colors">O Nama</Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">Pregled</Link>
        <Link to="/contact" className="text-gray-300 hover:text-white font-medium transition-colors">Kontakt</Link>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full pl-1 pr-3 py-1 transition"
            >
              {/* Inicijali umesto upitnika */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <span className="text-white text-sm font-medium max-w-[120px] truncate">{user.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-medium">
                    {isCraftsman ? 'Majstor' : 'Korisnik'}
                  </span>
                </div>

                <div className="py-1">
                  <Link to="/chat" onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition text-sm">
                    <MessageSquare className="w-4 h-4" /> Poruke
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition text-sm">
                    <ClipboardList className="w-4 h-4" /> Pregled
                  </Link>
                  <Link to="/profile/settings" onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition text-sm">
                    <Settings className="w-4 h-4" /> Podešavanja naloga
                  </Link>
                  
                </div>

                <div className="border-t border-gray-700 py-1">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-gray-700 transition text-sm">
                    <LogOut className="w-4 h-4" /> Odjavi se
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Button type="secondary" btnText="Prijava" to="/login" />
            <Button type="primary" btnText="Registracija" to="/register" />
          </>
        )}
      </nav>

      {/* Hamburger Button - Mobile */}
      <button className="md:hidden text-white z-50 p-2 hover:bg-gray-800/50 rounded-lg transition" onClick={toggleMenu}>
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
      <div className={`fixed top-0 right-0 h-full w-72 z-40 ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}>
        <nav className="flex flex-col gap-6 p-8 pt-24 bg-black">
          <Link to="/" onClick={toggleMenu} className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">Početna</Link>
          <Link to="/about" onClick={toggleMenu} className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">O Nama</Link>
          <Link to="/dashboard" onClick={toggleMenu} className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">Pregled</Link>
          <Link to="/contact" onClick={toggleMenu} className="text-white hover:text-blue-400 font-medium text-lg transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">Kontakt</Link>

          <div className="pt-4 border-t border-gray-700">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{isCraftsman ? 'Majstor' : 'Korisnik'}</p>
                  </div>
                </div>
                <Link to="/profile/settings" onClick={toggleMenu}
                  className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800/50 transition">
                  <Settings className="w-4 h-4" /> Podešavanja naloga
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 px-4 rounded-lg hover:bg-gray-800/50 transition w-full">
                  <LogOut className="w-4 h-4" /> Odjavi se
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button type="secondary" btnText="Prijava" to="/login" />
                <Button type="primary" btnText="Registracija" to="/register" />
              </div>
            )}
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={toggleMenu} />
      )}
    </>
  );
}