import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-3xl mb-3">Plaćanje otkazano</h2>
          <p className="text-gray-400 mb-8">Niste završili plaćanje. Vaša porudžbina je sačuvana i možete platiti kasnije.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/my-orders"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition"
            >
              Moje porudžbine
            </Link>
            <Link
              to="/browse-tasks"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
            >
              Pronađi majstora
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}