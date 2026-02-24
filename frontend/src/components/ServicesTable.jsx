import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ServicesTable({ services, onAddService }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "U toku": return "bg-blue-600";
      case "Zakazano": return "bg-yellow-600";
      case "Završeno": return "bg-green-600";
      case "Otkazano": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "U toku": return <Clock className="w-4 h-4" />;
      case "Završeno": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#1e2028] rounded-2xl p-6 lg:p-8 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Moji Poslovi</h2>
        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
        >
          <Plus className="w-5 h-5" />
          Dodaj Posao
        </button>
      </div>

      {/* Empty State */}
      {services.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nemate aktivnih poslova</h3>
          <p className="text-gray-400 mb-6">Kliknite na dugme iznad da dodate novi posao</p>
          <button
            onClick={onAddService}
            className="px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
          >
            Dodaj Prvi Posao
          </button>
        </div>
      ) : (
        /* Services Table */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-semibold py-3 px-4">ID</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Datum</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Opis</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Status</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Hitno</th>
                <th className="text-right text-gray-400 font-semibold py-3 px-4">Cena</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr 
                  key={service.jobId}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20 transition cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">#{service.jobId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{formatDate(service.scheduledDate)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{service.jobDescription}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      {service.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {service.urgent ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Da
                      </span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-white font-semibold">{service.totalPrice.toLocaleString()} RSD</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}