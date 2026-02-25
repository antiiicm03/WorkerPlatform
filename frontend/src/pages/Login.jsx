import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Header from "../components/Header";
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const API_BASE = "http://localhost:5114";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        if (json.errors) {
          setErrors(Object.values(json.errors).flat());
        } else {
          setErrors([json.message || 'Pogrešan email ili lozinka']);
        }
        setLoading(false);
        return;
      }

      const data = json.data;
      login(data);

      if (data.role === 'Craftsman') {
        navigate('/workers/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      setErrors(['Greška pri povezivanju sa serverom. Pokušajte ponovo.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300">Log in to access your account</p>
            </div>

            {/* Error poruke */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                <p className="text-red-400 text-sm font-semibold mb-2">Molimo ispravite sledeće greške:</p>
                <ul className="space-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-red-400 text-sm flex items-start gap-2">
                      <span className="mt-0.5 text-red-500 flex-shrink-0">•</span>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-gray-300 mb-3 font-medium">
                  Prijavljujem se kao:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, userType: 'user' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${formData.userType === 'user' ? 'bg-blue-600 text-white border-2 border-blue-500' : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'}`}>
                    User
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, userType: 'craftsman' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${formData.userType === 'craftsman' ? 'bg-blue-600 text-white border-2 border-blue-500' : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'}`}>
                    Worker
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="your.email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Lozinka</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Prijavljivanje...' : 'Log In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">🔒 Your data is secure and encrypted</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;