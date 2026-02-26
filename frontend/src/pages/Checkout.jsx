import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Clock, MapPin, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';

const API_BASE = "http://localhost:5114";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem('checkoutData', JSON.stringify(location.state));
    }
  }, [location.state]);

  const bookingData = location.state || JSON.parse(sessionStorage.getItem('checkoutData') || 'null');

  useEffect(() => {
    if (!bookingData) {
      navigate('/browse-tasks');
    }
  }, []);

  if (!bookingData) return null;

  const { craftsman, jobOrder, jobId } = bookingData;
  const token = user?.accessToken || localStorage.getItem('accessToken');

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    const currentUserId = user?.id;
    if (!currentUserId) {
      setError('Vaša sesija je istekla. Molimo prijavite se ponovo.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: jobId,
          userId: currentUserId,
          craftsmanId: craftsman.craftsmanId,
          amount: jobOrder.totalPrice,
          jobDescription: jobOrder.jobDescription,
          craftsmanName: `${craftsman.firstName} ${craftsman.lastName}`
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || data.error || 'Greška pri kreiranju sesije');

      // Obriši tek kada stvarno odemo na Stripe
      sessionStorage.removeItem('checkoutData');
      window.location.href = data.url;

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Plaćanje</h1>
          <p className="text-gray-400 mb-8">Pregledajte detalje pre plaćanja</p>

          <div className="grid gap-6">
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Detalji usluge</h2>
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  {craftsman.firstName?.[0]}{craftsman.lastName?.[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{craftsman.firstName} {craftsman.lastName}</p>
                  <p className="text-blue-400 text-sm capitalize">{craftsman.profession}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Datum: <span className="text-white">{new Date(jobOrder.scheduledDate).toLocaleString('sr-RS')}</span></span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Lokacija: <span className="text-white">{craftsman.location}</span></span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Opis: <span className="text-white">{jobOrder.jobDescription}</span></span>
                </div>
                {jobOrder.urgent && (
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs px-3 py-1 rounded-full">
                    ⚡ Hitna intervencija
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Pregled cene</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Cena po satu</span>
                  <span>{craftsman.hourlyRate.toLocaleString()} RSD</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Broj sati</span>
                  <span>{jobOrder.estimatedHours}h</span>
                </div>
                {jobOrder.urgent && (
                  <div className="flex justify-between text-orange-400 text-sm">
                    <span>Hitna intervencija</span>
                    <span>uključeno</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-white font-bold text-lg">Ukupno</span>
                  <span className="text-white font-bold text-2xl">{jobOrder.totalPrice.toLocaleString()} RSD</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400 text-sm bg-gray-800/30 rounded-xl p-4">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Plaćanje je sigurno i zaštićeno od strane <span className="text-white font-medium">Stripe</span>.</span>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition font-medium"
              >
                Nazad
              </button>
              <button
                onClick={handleStripeCheckout}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preusmeravanje...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Plati {jobOrder.totalPrice.toLocaleString()} RSD
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}