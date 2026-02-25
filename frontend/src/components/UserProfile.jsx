import { useState, useEffect } from "react";
import { User, Phone, Edit2, Save, X, MapPin } from "lucide-react";

export default function UserProfile({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  // Update formData when data prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#1e2028] rounded-2xl p-6 lg:p-8 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Moj Profil</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition"
          >
            <Edit2 className="w-4 h-4" />
            Izmeni
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              Sačuvaj
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <X className="w-4 h-4" />
              Otkaži
            </button>
          </div>
        )}
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <User className="w-4 h-4" />
            Ime
          </label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          ) : (
            <p className="text-white text-lg">{data.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <User className="w-4 h-4" />
            Prezime
          </label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          ) : (
            <p className="text-white text-lg">{data.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Phone className="w-4 h-4" />
            Telefon
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          ) : (
            <p className="text-white text-lg">{data.phone}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            Lokacija
          </label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none"
            />
          ) : (
            <p className="text-white text-lg">{data.location || 'Nije navedeno'}</p>
          )}
        </div>
      </div>
    </div>
  );
}