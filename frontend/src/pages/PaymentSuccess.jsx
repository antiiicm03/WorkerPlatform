import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:5114";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState(null);

  const jobId = searchParams.get('jobId');
  const sessionId = searchParams.get('session_id');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!jobId || !sessionId) {
      navigate('/');
      return;
    }

    const confirmPayment = async () => {
      try {
        // Dohvatamo iznos iz session storage (sačuvan pre redirecta)
        const amount = parseFloat(sessionStorage.getItem('checkoutAmount') || '0');

        await fetch(`${API_BASE}/api/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sessionId,
            jobId: parseInt(jobId),
            amount
          })
        });

        sessionStorage.removeItem('checkoutAmount');
      } catch (err) {
        setError('Plaćanje je prošlo ali nije evidentirano. Kontaktirajte podršku.');
      } finally {
        setConfirming(false);
      }
    };

    confirmPayment();
  }, [jobId, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-10 max-w-md w-full text-center">
          {confirming ? (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-white font-bold text-2xl mb-2">Potvrđujemo plaćanje...</h2>
              <p className="text-gray-400">Molimo sačekajte trenutak.</p>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">Upozorenje</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition">
                Početna stranica
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-white font-bold text-3xl mb-3">Plaćanje uspešno!</h2>
              <p className="text-gray-400 mb-2">Vaša porudžbina je potvrđena.</p>
              <p className="text-gray-500 text-sm mb-8">Majstor će vas kontaktirati uskoro.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/my-orders"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition"
                >
                  Pogledaj porudžbine
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
                >
                  Početna stranica
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}