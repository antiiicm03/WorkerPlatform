import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';

const API_BASE = "http://localhost:5114";

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const token = user?.accessToken || localStorage.getItem('accessToken');

  useEffect(() => {
    if (!user?.id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          const u = json.data;
          setProfileForm({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            phone: u.phone || '',
            location: u.location || '',
          });
        }
      } catch (err) {
        console.error('Greška pri učitavanju profila:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone,
          location: profileForm.location,
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Greška pri ažuriranju');

      updateUser({
        name: `${profileForm.firstName} ${profileForm.lastName}`,
        email: profileForm.email,
      });

      setSuccess('Profil uspešno ažuriran!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Nove lozinke se ne poklapaju!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError('Lozinka mora imati najmanje 8 karaktera.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Greška pri promeni lozinke');
      setSuccess('Lozinka uspešno promenjena!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30">
                {user?.role === 'Craftsman' ? 'Majstor' : 'Korisnik'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button onClick={() => { setActiveTab('profile'); setError(null); setSuccess(null); }}
              className={`px-6 py-3 text-sm font-medium transition border-b-2 ${activeTab === 'profile' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}>
              Lični podaci
            </button>
            <button onClick={() => { setActiveTab('password'); setError(null); setSuccess(null); }}
              className={`px-6 py-3 text-sm font-medium transition border-b-2 ${activeTab === 'password' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}>
              Promena lozinke
            </button>
          </div>

          {/* Feedback */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm mb-6">
              <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><User className="w-4 h-4" /> Ime</label>
                  <input type="text" value={profileForm.firstName} required
                    onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><User className="w-4 h-4" /> Prezime</label>
                  <input type="text" value={profileForm.lastName} required
                    onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Mail className="w-4 h-4" /> Email</label>
                <input type="email" value={profileForm.email} required
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Phone className="w-4 h-4" /> Telefon</label>
                <input type="tel" value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><MapPin className="w-4 h-4" /> Lokacija</label>
                <input type="text" value={profileForm.location}
                  onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition disabled:opacity-50 text-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Čuvanje...</> : <><Save className="w-4 h-4" /> Sačuvaj izmene</>}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSave} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Lock className="w-4 h-4" /> Stara lozinka</label>
                <div className="relative">
                  <input type={showOldPassword ? 'text' : 'password'} value={passwordForm.oldPassword} required
                    onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Lock className="w-4 h-4" /> Nova lozinka</label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} value={passwordForm.newPassword} required minLength={8}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 karaktera</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Lock className="w-4 h-4" /> Potvrdi novu lozinku</label>
                <input type="password" value={passwordForm.confirmPassword} required
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition disabled:opacity-50 text-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Čuvanje...</> : <><Save className="w-4 h-4" /> Promeni lozinku</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}