import { useState } from "react";
import { X, Calendar, DollarSign, AlertCircle } from "lucide-react";

export default function AddJobModal({ isOpen, onClose, onSubmit, craftsmanId }) {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    jobDescription: '',
    status: 'Zakazano',
    urgent: false,
    totalPrice: '',
    userId: 1, // TODO: Get from logged in user context
    craftsmanId: craftsmanId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Convert form data to match backend model
      const jobOrder = {
        JobId: 0,
        ScheduledDate: new Date(formData.scheduledDate).toISOString(),
        JobDescription: formData.jobDescription,
        Status: formData.status, 
        Urgent: formData.urgent, 
        TotalPrice: parseFloat(formData.totalPrice),
        UserId: formData.userId, 
        CraftsmanId: formData.craftsmanId 
    };

      
      console.log('Submitting job order:', jobOrder);

      await onSubmit(jobOrder);
      
      // Reset form and close modal
      setFormData({
        scheduledDate: '',
        jobDescription: '',
        status: 'Zakazano',
        urgent: false,
        totalPrice: '',
        userId: 1,
        craftsmanId: craftsmanId
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Greška pri kreiranju posla');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e2028] rounded-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Dodaj Novi Posao</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Scheduled Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              Zakazani Datum i Vreme
            </label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Opis Posla
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Opišite detalje posla..."
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            >
              <option value="Zakazano">Zakazano</option>
              <option value="U toku">U toku</option>
              <option value="Završeno">Završeno</option>
              <option value="Otkazano">Otkazano</option>
            </select>
          </div>

          {/* Total Price */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              Ukupna Cena (RSD)
            </label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          </div>

          {/* Urgent Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="urgent"
              name="urgent"
              checked={formData.urgent}
              onChange={handleChange}
              className="w-5 h-5 bg-[#262431] border-gray-600 rounded focus:ring-2 focus:ring-[#2324fe]"
            />
            <label htmlFor="urgent" className="text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Hitan posao
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Kreiranje...' : 'Dodaj Posao'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}