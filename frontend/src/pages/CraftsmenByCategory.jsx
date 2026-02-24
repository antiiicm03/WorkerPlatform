import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Hammer,
  Armchair,
  Wind,
  Droplets,
  PaintBucket,
  Tv,
  Car,
  MapPin,
  Clock,
  Star,
  Briefcase,
  ArrowLeft,
  Phone,
  Mail,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";


const categoryConfig = {
  plumbers: {
    name: 'Plumbers',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    bgAccent: 'blue',
    apiProfession: 'plumber',
    description: 'Expert plumbers for all your pipe and water needs'
  },
  electricians: {
    name: 'Electricians',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgAccent: 'yellow',
    apiProfession: 'electrician',
    description: 'Certified electricians for safe and reliable electrical work'
  },
  handymen: {
    name: 'Handymen',
    icon: Hammer,
    color: 'from-purple-500 to-pink-500',
    bgAccent: 'purple',
    apiProfession: 'handyman',
    description: 'Skilled handymen ready for any home repair or maintenance task'
  },
  'furniture-assembly': {
    name: 'Furniture Assembly',
    icon: Armchair,
    color: 'from-green-500 to-emerald-500',
    bgAccent: 'green',
    apiProfession: 'furniture assembly',
    description: 'Professional furniture assembly and installation specialists'
  },
  'air-conditioning': {
    name: 'Air Conditioning',
    icon: Wind,
    color: 'from-cyan-500 to-blue-500',
    bgAccent: 'cyan',
    apiProfession: 'air conditioning',
    description: 'AC experts for installation, repair, and maintenance'
  },
  painters: {
    name: 'Painters',
    icon: PaintBucket,
    color: 'from-red-500 to-pink-500',
    bgAccent: 'red',
    apiProfession: 'painter',
    description: 'Skilled painters for beautiful interior and exterior finishes'
  },
  'tv-mounting': {
    name: 'TV Mounting',
    icon: Tv,
    color: 'from-indigo-500 to-purple-500',
    bgAccent: 'indigo',
    apiProfession: 'tv mounting',
    description: 'Professional TV mounting and home theater installation'
  },
  'auto-mechanics': {
    name: 'Auto Mechanics',
    icon: Car,
    color: 'from-gray-600 to-gray-800',
    bgAccent: 'gray',
    apiProfession: 'auto mechanic',
    description: 'Trusted mechanics for all vehicle repairs and maintenance'
  },
  'general-help': {
    name: 'General Help',
    icon: Wrench,
    color: 'from-blue-600 to-indigo-600',
    bgAccent: 'blue',
    apiProfession: 'general help',
    description: 'Versatile helpers for various home and office tasks'
  }
};

const StarRating = ({ rating }) => {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rounded ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const CraftsmanCard = ({ craftsman }) => {
  const initials = `${craftsman.firstName?.[0] ?? ''}${craftsman.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="group bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/60 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
            {initials || '?'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
              {craftsman.firstName} {craftsman.lastName}
            </h3>
            <p className="text-blue-400 text-sm font-medium capitalize">{craftsman.profession}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              {craftsman.averageRating != null ? (
                <>
                  <StarRating rating={craftsman.averageRating} />
                  <span className="text-gray-400 text-sm">{craftsman.averageRating.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-gray-500 text-sm">No reviews yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-gray-700/60" />

      {/* Details */}
      <div className="p-6 pt-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">{craftsman.location || 'Location not specified'}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{craftsman.experience} year{craftsman.experience !== 1 ? 's' : ''} of experience</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{craftsman.workingHours || 'Hours not specified'}</span>
        </div>

        {/* Hourly Rate */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-white">${craftsman.hourlyRate}</span>
            <span className="text-gray-400 text-sm ml-1">/hr</span>
          </div>

          <Link
            to={`/craftsmen/${craftsman.craftsmanId}`}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/30"
          >
            Hire
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Contact row */}
      <div className="px-6 pb-5 flex gap-3">
        <a
          href={`mailto:${craftsman.email}`}
          className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors text-xs"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{craftsman.email}</span>
        </a>
        <span className="text-gray-700">·</span>
        <a
          href={`tel:${craftsman.phone}`}
          className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors text-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{craftsman.phone}</span>
        </a>
      </div>
    </div>
  );
};

const CraftsmenByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const config = categoryConfig[category];

  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); 

  useEffect(() => {
    if (!config) {
      navigate('/browse');
      return;
    }

    const fetchCraftsmen = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:26125/api/craftsmen/profession/${encodeURIComponent(config.apiProfession)}`
        );
        if (!response.ok) throw new Error('Failed to fetch craftsmen');
        const json = await response.json();
        setCraftsmen(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCraftsmen();
  }, [category, config, navigate]);

  const sortedCraftsmen = [...craftsmen].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      case 'price_asc':
        return a.hourlyRate - b.hourlyRate;
      case 'price_desc':
        return b.hourlyRate - a.hourlyRate;
      case 'experience':
        return b.experience - a.experience;
      default:
        return 0;
    }
  });

  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to categories
          </button>

          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden mb-10 bg-gray-800/50 border border-gray-700">
            {/* Background gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10`} />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {config.name}
                </h1>
                <p className="text-gray-300 text-lg">{config.description}</p>
              </div>
              {!loading && !error && (
                <div className="md:ml-auto text-right">
                  <div className="text-4xl font-bold text-white">{craftsmen.length}</div>
                  <div className="text-gray-400">Available tasker{craftsmen.length !== 1 ? 's' : ''}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sort Bar */}
          {!loading && !error && craftsmen.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-gray-400 text-sm">Sort by:</span>
              {[
                { value: 'rating', label: 'Top Rated' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'experience', label: 'Most Experienced' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === opt.value
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-400">Loading {config.name.toLowerCase()}...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Failed to load craftsmen</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && craftsmen.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${config.color} opacity-30 rounded-2xl flex items-center justify-center`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">No {config.name} available</h3>
              <p className="text-gray-400 max-w-md">
                There are currently no {config.name.toLowerCase()} registered. Check back soon or browse other categories.
              </p>
              <Link
                to="/browse"
                className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-semibold"
              >
                Browse other categories
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && sortedCraftsmen.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCraftsmen.map(craftsman => (
                <CraftsmanCard key={craftsman.craftsmanId} craftsman={craftsman} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CraftsmenByCategory;