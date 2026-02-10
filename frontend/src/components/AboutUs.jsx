import { Link } from 'react-router-dom';
import { CheckCircle, Users, Wrench, MessageCircle } from 'lucide-react';
import majstorijaLogoMain from "../assets/majstorijaLogoMain.png";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <img 
                src={majstorijaLogoMain} 
                alt="Majstorija Logo" 
                className="max-w-[150px] md:max-w-[200px] hover:opacity-90 transition-opacity" 
              />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <Link to="/about" className="text-blue-400 hover:text-blue-300 transition">About Us</Link>
              <Link to="/users" className="text-gray-300 hover:text-white transition">For Users</Link>
              <Link to="/workers" className="text-gray-300 hover:text-white transition">For Workers</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition">Contact Us</Link>
            </div>
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About Majstorija
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connecting communities through trusted local services since 2026
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Founded in 2026, Majstorija was born from a simple observation: finding reliable, trustworthy local service providers shouldn't be complicated. We recognized that everyday people struggle to connect with skilled workers for home repairs, maintenance, and various tasks, while talented professionals often find it challenging to reach potential clients.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Our platform bridges this gap by creating a transparent, secure marketplace where users can easily find and hire verified local workers for any task, big or small. Whether you need a plumber, electrician, handyman, or help with furniture assembly, Majstorija makes the process simple and reliable.
          </p>
        </div>

      
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Users</h3>
              <p className="text-gray-300 leading-relaxed">
                We help you find qualified professionals for any home or office task. Post your job, receive offers from verified workers, compare profiles and reviews, and choose the best person for the job—all in one place.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Workers</h3>
              <p className="text-gray-300 leading-relaxed">
                We provide skilled professionals with a platform to grow their business, connect with clients who need their services, build their reputation through reviews, and manage their work schedule efficiently.
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/30 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Majstorija Helps Everyday Life</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Saves Time</h3>
              <p className="text-gray-300">
                No more endless searching or unreliable contacts. Find the right professional quickly and efficiently.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Builds Trust</h3>
              <p className="text-gray-300">
                Verified workers, transparent reviews, and secure payments create a safe environment for everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Supports Local</h3>
              <p className="text-gray-300">
                Strengthens local communities by connecting neighbors with skilled professionals nearby.
              </p>
            </div>
          </div>
        </div>

     
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Who Is Majstorija For?</h2>
          <p className="text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            Majstorija is designed for everyone who needs help with tasks or wants to offer their professional services:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Homeowners & Renters</h3>
              <p className="text-gray-300">
                Anyone who needs repairs, installations, or maintenance around the house.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Busy Professionals</h3>
              <p className="text-gray-300">
                People who don't have time to handle household tasks themselves.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Small Businesses</h3>
              <p className="text-gray-300">
                Companies that need quick access to reliable service providers.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Skilled Workers</h3>
              <p className="text-gray-300">
                Professionals looking to expand their client base and grow their business.
              </p>
            </div>
          </div>
        </div>

        
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/30 text-center">
          <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help or Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to assist you. Feel free to reach out anytime.
          </p>
          <Link to="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
              Contact Our Service
            </button>
          </Link>
        </div>
      </div>

     
      <footer className="bg-gray-900/80 border-t border-gray-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2026 Majstorija. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;