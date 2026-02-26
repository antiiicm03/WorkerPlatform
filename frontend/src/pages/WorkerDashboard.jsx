import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkerProfile from "../components/WorkerProfile";
import ServicesTable from "../components/ServicesTable";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function WorkerDashboard() {
  const { user } = useAuth();

  const [workerData, setWorkerData] = useState(null);
  const [originalWorkerData, setOriginalWorkerData] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.getCraftsmanProfile(user.id);
      const craftsman = response.data || response;
      setOriginalWorkerData(craftsman);
      setWorkerData({
        craftsmanId: craftsman.craftsmanId,
        firstName: craftsman.firstName,
        lastName: craftsman.lastName,
        email: craftsman.email,
        phone: craftsman.phone,
        profession: craftsman.profession,
        experience: craftsman.experience,
        workingHours: craftsman.workingHours,
        hourlyRate: craftsman.hourlyRate,
        location: craftsman.location || '',
        averageRating: craftsman.averageRating || 0,
        ratingCount: craftsman.ratingCount || 0
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Greška pri učitavanju profila');
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.getJobOrdersByCraftsman(user.id);
      const jobs = response.data || response;
      setServices(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Greška pri učitavanju poslova');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const craftsmanUpdate = {
        ...originalWorkerData,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
        location: updatedData.location,
        profession: updatedData.profession,
        experience: parseInt(updatedData.experience),
        hourlyRate: parseFloat(updatedData.hourlyRate),
        workingHours: updatedData.workingHours,
      };
      const response = await api.updateCraftsman(user.id, craftsmanUpdate);
      if (response.success) {
        setOriginalWorkerData(craftsmanUpdate);
        setWorkerData(updatedData);
        alert('Profil uspešno ažuriran!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Greška pri ažuriranju profila: ' + err.message);
      throw err;
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.updateJobStatus(jobId, newStatus);
      setServices(prev =>
        prev.map(j => j.jobId === jobId ? { ...j, status: newStatus } : j)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Greška pri ažuriranju statusa: ' + err.message);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj posao?')) return;
    try {
      await api.deleteJobOrder(jobId);
      setServices(prev => prev.filter(job => job.jobId !== jobId));
      alert('Posao uspešno obrisan!');
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Greška pri brisanju posla: ' + err.message);
    }
  };

  if (!workerData) {
    return (
      <div className="min-h-screen bg-[#121418] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2324fe] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121418] flex flex-col">
      <Header />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Dobrodošli, {workerData.firstName}!</h1>
              <p className="text-gray-400">Email: {workerData.email}</p>
            </div>
            <Link to="/workers/chat">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition">
                <MessageCircle className="w-5 h-5" />
                Moje Poruke
              </button>
            </Link>
          </div>

          <WorkerProfile
            data={workerData}
            onUpdate={handleProfileUpdate}
          />

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="mt-10">
            {isLoading ? (
              <div className="bg-[#1e2028] rounded-2xl p-8 border border-gray-700 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#2324fe] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Učitavanje poslova...</p>
              </div>
            ) : (
              <ServicesTable
                services={services}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}