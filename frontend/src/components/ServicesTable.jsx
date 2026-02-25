import { Plus } from "lucide-react";

export default function ServicesTable({ 
  services, 
  onAddService, 
  buttonText = "Dodaj Novi Posao", // Default for workers
  buttonIcon = <Plus className="w-5 h-5" /> // Default icon
}) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'u toku': return 'bg-blue-600 text-blue-100';
      case 'zakazano': return 'bg-yellow-600 text-yellow-100';
      case 'završeno': return 'bg-green-600 text-green-100';
      case 'otkazano': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="bg-[#1e2028] rounded-2xl p-6 lg:p-8 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Moji Poslovi</h2>
        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
        >
          {buttonIcon}
          {buttonText}
        </button>
      </div>

      {/* Table */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Nema poslova za prikaz</p>
          <button
            onClick={onAddService}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
          >
            {buttonIcon}
            {buttonText}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-4 px-4">Opis</th>
                <th className="text-left text-gray-400 font-medium py-4 px-4">Datum</th>
                <th className="text-left text-gray-400 font-medium py-4 px-4">Status</th>
                <th className="text-left text-gray-400 font-medium py-4 px-4">Cena</th>
                <th className="text-left text-gray-400 font-medium py-4 px-4">Hitno</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.jobId} className="border-b border-gray-700 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4 text-white">{service.jobDescription || 'Bez opisa'}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(service.scheduledDate).toLocaleDateString('sr-RS', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{service.totalPrice.toLocaleString()} RSD</td>
                  <td className="py-4 px-4">
                    {service.urgent ? (
                      <span className="text-red-400 font-medium">Da</span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
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