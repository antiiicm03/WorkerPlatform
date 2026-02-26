import { Link } from 'react-router-dom';
import { 
  Wrench, Zap, Hammer, Armchair, Wind, Droplets, PaintBucket, Tv, Car
} from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const BrowseTasks = () => {
  const { user } = useAuth(); // ← UNUTAR komponente

  const categories = [
    {
      id: 1,
      name: 'Vodoinstalater',
      slug: 'plumbers',
      icon: Droplets,
      description: 'Popravka cevki, instalacije, popravka curenja',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Električar',
      slug: 'electricians',
      icon: Zap,
      description: 'Električne popravke, ožičenje, instalacije',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      name: 'Zanatlije',
      slug: 'handymen',
      icon: Hammer,
      description: 'Generalne popravke i održavanje kuće',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      name: 'Montaža Nameštaja',
      slug: 'furniture-assembly',
      icon: Armchair,
      description: 'Sklapanje i instalacija nameštaja',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      name: 'Klima uređaji',
      slug: 'air-conditioning',
      icon: Wind,
      description: 'Popravka klime, održavanje i instalacija',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 6,
      name: 'Moleri',
      slug: 'painters',
      icon: PaintBucket,
      description: 'Krečenje interijera i eksterijera',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 7,
      name: 'Ugradnja Televizora',
      slug: 'tv-mounting',
      icon: Tv,
      description: 'Profesionalna instalacija televizora i ugradnja',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 8,
      name: 'Auto Mehaničari',
      slug: 'auto-mechanics',
      icon: Car,
      description: 'Popravka vozila i održavanje',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 9,
      name: 'Generalne Potrebe',
      slug: 'general-help',
      icon: Wrench,
      description: 'Razne pomoći oko kuće i okruženja',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  // Angažujte Radnika — neulogovan ili user → /browse-tasks, majstor ostaje ovde
  const hireLink = !user ? '/register' : '/browse-tasks';

  // Postanite Radnik — neulogovan ili user → /register, majstor ostaje na browse-tasks
  const workerLink = user?.role === 'Craftsman' ? '/browse-tasks' : '/register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Angažujte Pouzdanu Pomoć za Kućne Poslove
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Objavite zadatak. Izaberite najboljeg. Završite posao.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to={hireLink}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                Angažujte Radnika
              </Link>
              <Link to={workerLink}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
                Postanite Radnik
              </Link>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{category.description}</p>
                  <Link to={`/craftsmen/${category.slug}`}
                    className="inline-block bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold px-6 py-2 rounded-lg transition-all border border-blue-500/30 hover:border-blue-500">
                    Angažujte Radnika
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">1M+</div>
                <div className="text-gray-300 text-lg">Korisnici</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">2.5M+</div>
                <div className="text-gray-300 text-lg">Završenih Poslova</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">140+</div>
                <div className="text-gray-300 text-lg">Recenzije Korisnika</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Kako Funkcioniše</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">1</div>
                <h3 className="text-xl font-bold text-white mb-2">Izaberite Vaš Zadatak</h3>
                <p className="text-gray-300">Odaberite iz naše široke ponude usluga i opišite šta vam je potrebno.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">2</div>
                <h3 className="text-xl font-bold text-white mb-2">Bićete Povezani</h3>
                <p className="text-gray-300">Primajte ponude od kvalifikovanih radnika u vašem kraju.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">3</div>
                <h3 className="text-xl font-bold text-white mb-2">Završite Posao</h3>
                <p className="text-gray-300">Vaš radnik obavlja posao, a vi plaćate sigurno.</p>
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