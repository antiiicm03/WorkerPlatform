import { useState, useEffect } from "react";
import { User, Briefcase, Clock, DollarSign, Phone, Edit2, Save, X, MapPin } from "lucide-react";

// Mapa engleskih profesija na srpski
const PROFESSION_MAP = {
  "electrician": "Električar",
  "plumber": "Vodoinstalater",
  "carpenter": "Stolar",
  "painter": "Moler",
  "mason": "Zidar",
  "locksmith": "Bravar",
  "welder": "Autolimar / Zavarivač",
  "roofer": "Krovopokrivač",
  "tiler": "Pločičar",
  "glazier": "Staklar",
  "hvac": "Klimatičar / Grejanje",
  "cleaner": "Čistač",
  "gardener": "Vrtlar",
  "mover": "Selidbe",
  "handyman": "Majstor za sve",
};

const translateProfession = (profession) => {
  if (!profession) return '';
  const key = profession.toLowerCase().trim();
  return PROFESSION_MAP[key] || profession; // ako nema prevoda, prikaži original
};

export default function WorkerProfile({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

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
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Save className="w-4 h-4" /> Sačuvaj
            </button>
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
              <X className="w-4 h-4" /> Otkaži
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><User className="w-4 h-4" /> Ime</label>
          {isEditing ? (
            <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.firstName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><User className="w-4 h-4" /> Prezime</label>
          {isEditing ? (
            <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.lastName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Phone className="w-4 h-4" /> Telefon</label>
          {isEditing ? (
            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.phone}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><MapPin className="w-4 h-4" /> Lokacija</label>
          {isEditing ? (
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange}
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.location || 'Nije navedeno'}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Briefcase className="w-4 h-4" /> Profesija</label>
          {isEditing ? (
            <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} required
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : (
            // Prikazujemo prevedenu profesiju
            <p className="text-white text-lg">{translateProfession(data.profession)}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Briefcase className="w-4 h-4" /> Iskustvo (godine)</label>
          {isEditing ? (
            <input type="number" name="experience" value={formData.experience || 0} onChange={handleChange} required min="0"
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.experience} godina</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Clock className="w-4 h-4" /> Radno vreme</label>
          {isEditing ? (
            <input type="text" name="workingHours" value={formData.workingHours || ''} onChange={handleChange} required placeholder="npr. Pon-Pet: 8:00-17:00"
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.workingHours}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-2"><DollarSign className="w-4 h-4" /> Cena po satu (RSD)</label>
          {isEditing ? (
            <input type="number" name="hourlyRate" value={formData.hourlyRate || 0} onChange={handleChange} required min="0" step="0.01"
              className="w-full bg-[#262431] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2324fe] focus:outline-none" />
          ) : <p className="text-white text-lg">{data.hourlyRate} RSD</p>}
        </div>
      </div>
    </div>
  );
}