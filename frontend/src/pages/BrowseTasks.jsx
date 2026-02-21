import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Armchair, 
  Wind, 
  Droplets,
  PaintBucket,
  Tv,
  Car
} from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const BrowseTasks = () => {
  const categories = [
    {
      id: 1,
      name: 'Plumbers',
      icon: Droplets,
      description: 'Pipe repairs, installations, and leak fixes',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Electricians',
      icon: Zap,
      description: 'Electrical repairs, wiring, and installations',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      name: 'Handymen',
      icon: Hammer,
      description: 'General repairs and home maintenance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      name: 'Furniture Assembly',
      icon: Armchair,
      description: 'Assemble and install furniture',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      name: 'Air Conditioning',
      icon: Wind,
      description: 'AC repair, installation, and maintenance',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 6,
      name: 'Painters',
      icon: PaintBucket,
      description: 'Interior and exterior painting services',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 7,
      name: 'TV Mounting',
      icon: Tv,
      description: 'Professional TV installation and mounting',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 8,
      name: 'Auto Mechanics',
      icon: Car,
      description: 'Vehicle repairs and maintenance',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 9,
      name: 'General Help',
      icon: Wrench,
      description: 'Various home and office tasks',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
         
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Book Trusted Help for Home Tasks
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Post any task. Pick the best person. Get it done.
            </p>
            
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Hire Tasker
              </Link>
              <Link
                to="/register"
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Become a Tasker
              </Link>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                >
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {category.description}
                  </p>
                  
                  
                  <Link
                    to="/register"
                    className="inline-block bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold px-6 py-2 rounded-lg transition-all border border-blue-500/30 hover:border-blue-500"
                  >
                    Hire Tasker
                  </Link>
                </div>
              );
            })}
          </div>

          
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">1M+</div>
                <div className="text-gray-300 text-lg">Customers</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">2.5M+</div>
                <div className="text-gray-300 text-lg">Tasks Done</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">140+</div>
                <div className="text-gray-300 text-lg">User Reviews</div>
              </div>
            </div>
          </div>

          
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Task</h3>
                <p className="text-gray-300">
                  Select from our wide range of services and describe what you need.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Get Matched</h3>
                <p className="text-gray-300">
                  Receive offers from qualified taskers in your area.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Get It Done</h3>
                <p className="text-gray-300">
                  Your tasker completes the job and you pay securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <Footer />
    </div>
  );
};

export default BrowseTasks;