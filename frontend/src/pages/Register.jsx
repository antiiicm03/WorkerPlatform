import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Briefcase, Clock } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';

const API_BASE = "http://localhost:5114";

const professions = [
  { label: 'Vodoinstalater',      value: 'plumber' },
  { label: 'Električar',          value: 'electrician' },
  { label: 'Zanatlija',           value: 'handyman' },
  { label: 'Sklapanje nameštaja', value: 'furniture assembly' },
  { label: 'Klima uređaj',        value: 'air conditioning' },
  { label: 'Moler',               value: 'painter' },
  { label: 'Postavljanje TV-a',   value: 'tv mounting' },
  { label: 'Auto mehaničar',      value: 'auto mechanic' },
  { label: 'Opšta pomoć',         value: 'general help' },
];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
    agreeToTerms: false,
    location: '',
    profession: '',
    experience: '',
    hourlyRate: '',
    workingHours: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (formData.password !== formData.confirmPassword) {
      setErrors(['Lozinke se ne poklapaju!']);
      return;
    }
    if (!formData.agreeToTerms) {
      setErrors(['Morate prihvatiti uslove korišćenja']);
      return;
    }
    if (formData.userType === 'worker' && !formData.profession) {
      setErrors(['Molimo izaberite profesiju']);
      return;
    }

    setLoading(true);

    try {
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();

      let endpoint, body;

      if (formData.userType === 'worker') {
        endpoint = `${API_BASE}/api/auth/register/craftsman`;
        body = {
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          location: formData.location,
          profession: formData.profession,
          experience: parseInt(formData.experience),
          hourlyRate: parseFloat(formData.hourlyRate),
          workingHours: formData.workingHours
        };
      } else {
        endpoint = `${API_BASE}/api/auth/register/user`;
        body = {
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          location: formData.location || ''
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        if (json.errors) {
          setErrors(Object.values(json.errors).flat());
        } else {
          setErrors([json.message || 'Registracija nije uspela']);
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

  const isWorker = formData.userType === 'worker';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Registracija</h1>
              <p className="text-gray-300">Pridružite se Majstoriji i počnite danas.</p>
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

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* User Type Toggle */}
              <div>
                <label className="block text-gray-300 mb-3 font-medium">Prijavljujem se kao:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, userType: 'user' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${formData.userType === 'user' ? 'bg-blue-600 text-white border-2 border-blue-500' : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'}`}>
                    Korisnik
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, userType: 'worker' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${formData.userType === 'worker' ? 'bg-blue-600 text-white border-2 border-blue-500' : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'}`}>
                    Majstor
                  </button>
                </div>
              </div>

              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Ime</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ime" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Prezime</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Prezime" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="vas.email@primer.com" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Telefon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+381 60 123 4567" />
                </div>
              </div>

              {/* WORKER ONLY FIELDS */}
              {isWorker && (
                <>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-gray-800/80 text-blue-400 font-semibold tracking-widest uppercase">Profesionalne Informacije</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Lokacija</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="text" name="location" value={formData.location} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="npr. Beograd, Novi Sad..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Profesija</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                      <select name="profession" value={formData.profession} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer">
                        <option value="" disabled className="bg-gray-800 text-gray-400">Izaberite profesiju</option>
                       {professions.map((p) => (
                          <option key={p.value} value={p.value} className="bg-gray-800 text-white">
                            {p.label}
                          </option>
                        ))} 
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Godine Iskustva</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" max="60"
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="npr. 5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Satnica (RSD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm font-semibold">RSD</span>
                      </div>
                      <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" step="0.01"
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="npr. 1500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Radno vreme</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="npr. Pon-Pet 08:00-17:00" />
                    </div>
                  </div>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-gray-800/80 text-blue-400 font-semibold tracking-widest uppercase">Bezbednost Naloga</span>
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Lozinka</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Kreirajte jaku lozinku" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimum 8 karaktera</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Potvrdite lozinku</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Potvrdite lozinku" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange}
                  className="w-4 h-4 mt-1 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500" />
                <label className="ml-3 text-sm text-gray-300">
                  Prihvatam{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300">Uslove korišćenja</Link>
                  {' '}i{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">Politiku privatnosti</Link>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Kreiranje naloga...' : 'Kreiraj Nalog'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Već imate nalog?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">Prijavite se</Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">🔒 Vaši podaci su bezbedni i šifrovani</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;