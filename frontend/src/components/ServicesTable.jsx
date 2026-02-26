import { Plus, Trash2, AlertCircle, CheckCircle, XCircle, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["Zakazano", "U toku", "Završeno", "Otkazano"];

const STATUS_STYLES = {
  "U toku":   "bg-blue-600/20 text-blue-400 border-blue-500/40",
  "Zakazano": "bg-yellow-600/20 text-yellow-400 border-yellow-500/40",
  "Završeno": "bg-green-600/20 text-green-400 border-green-500/40",
  "Otkazano": "bg-red-600/20 text-red-400 border-red-500/40",
};

const SELECT_OPTION_BG = {
  "U toku":   "#1e3a5f",
  "Zakazano": "#3d3200",
  "Završeno": "#0f2d1a",
  "Otkazano": "#2d0f0f",
};

const normalizeStatus = (status) => {
  if (!status) return '';
  return status.toLowerCase().trim();
};

export default function ServicesTable({
  services,
  onAddService,
  onStatusChange,
  onDelete,
  buttonText = "Dodaj Novi Posao",
  buttonIcon = <Plus className="w-5 h-5" />
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('sr-RS', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const isPending = (status) => normalizeStatus(status) === 'zakazano';

  return (
    <div className="bg-[#1e2028] rounded-2xl p-6 lg:p-8 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Evidencija Servisa</h2>
        {onAddService && (
          <button
            onClick={onAddService}
            className="flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
          >
            {buttonIcon}
            {buttonText}
          </button>
        )}
      </div>

      {/* Empty state */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Nema poslova za prikaz</p>
          {onAddService && (
            <button
              onClick={onAddService}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
            >
              {buttonIcon}
              {buttonText}
            </button>
          )}
        </div>
      ) : (
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
                {onStatusChange && (
                  <th className="text-center text-gray-400 font-semibold py-3 px-4">Akcija</th>
                )}
                {onDelete && (
                  <th className="text-center text-gray-400 font-semibold py-3 px-4">Obriši</th>
                )}
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.jobId}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20 transition"
                >
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">#{service.jobId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{formatDate(service.scheduledDate)}</span>
                  </td>
                  <td className="py-4 px-4 max-w-[200px]">
                    <span className="text-white">{service.jobDescription || 'Bez opisa'}</span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {onStatusChange && !isPending(service.status) ? (
                      <div className="relative inline-flex">
                        <select
                          value={service.status}
                          onChange={(e) => onStatusChange(service.jobId, e.target.value)}
                          className={`
                            appearance-none cursor-pointer
                            pl-3 pr-8 py-1.5 rounded-full text-sm font-medium
                            border focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-white/20
                            transition-all
                            ${STATUS_STYLES[service.status] || "bg-gray-700/30 text-gray-300 border-gray-600"}
                          `}
                        >
                          {STATUS_OPTIONS.filter(s => s !== 'Zakazano').map((s) => (
                            <option
                              key={s}
                              value={s}
                              style={{ backgroundColor: SELECT_OPTION_BG[s] || "#1e2028", color: "white" }}
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_STYLES[service.status] || "bg-gray-700/30 text-gray-300 border-gray-600"}`}>
                        {service.status}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {service.urgent ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-sm">
                        <AlertCircle className="w-4 h-4" /> Da
                      </span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="text-white font-semibold">{service.totalPrice.toLocaleString()} RSD</span>
                  </td>

                  {/* Prihvati / Odbij — samo za zakazano */}
                  {onStatusChange && (
                    <td className="py-4 px-4 text-center">
                      {isPending(service.status) ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onStatusChange(service.jobId, 'U toku')}
                            title="Prihvati posao"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/40 rounded-lg text-xs font-semibold transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Prihvati
                          </button>
                          <button
                            onClick={() => onStatusChange(service.jobId, 'Otkazano')}
                            title="Odbij posao"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-lg text-xs font-semibold transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Odbij
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                  )}

                  {onDelete && (
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => onDelete(service.jobId)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                        title="Obriši posao"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}