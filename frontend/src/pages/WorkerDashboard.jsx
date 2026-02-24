import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkerProfile from "../components/WorkerProfile";
import ServicesTable from "../components/ServicesTable";
import AddJobModal from "../components/AddJobModal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function WorkerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [workerData, setWorkerData] = useState(null);
  const [originalWorkerData, setOriginalWorkerData] = useState(null); // Keep original for updates
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not logged in or not a craftsman
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'Craftsman')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch profile and jobs on mount
  useEffect(() => {
    if (user && user.role === 'Craftsman') {
      fetchProfile();
      fetchJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.getCraftsmanProfile(user.id);
      const craftsman = response.data || response;
      
      // Store the original data for updates
      setOriginalWorkerData(craftsman);
      
      // Transform for display
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
        averageRating: craftsman.averageRating || 0
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
      // Merge updated editable fields with original data (keeps email, password, etc.)
      const craftsmanUpdate = {
        ...originalWorkerData, // Start with all original data
        // Update only the editable fields
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
        // Update both original and display data
        setOriginalWorkerData(craftsmanUpdate);
        setWorkerData(updatedData);
        alert('Profil uspešno ažuriran!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Greška pri ažuriranju profila: ' + err.message);
      throw err; // Re-throw to prevent modal from closing on error
    }
  };

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleJobSubmit = async (jobOrder) => {
    try {
      const response = await api.createJobOrder(jobOrder);
      console.log('Job created:', response);
      
      // Refresh the jobs list
      await fetchJobs();
      
      alert('Posao uspešno dodat!');
    } catch (err) {
      console.error('Error creating job:', err);
      throw err;
    }
  };

  // Show loading while checking auth
  if (authLoading || !workerData) {
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
          {/* Quick Actions Bar */}
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

          {/* Worker Profile Section */}
          <WorkerProfile 
            data={workerData} 
            onUpdate={handleProfileUpdate}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Services Section */}
          <div className="mt-10">
            {isLoading ? (
              <div className="bg-[#1e2028] rounded-2xl p-8 border border-gray-700 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#2324fe] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Učitavanje poslova...</p>
              </div>
            ) : (
              <ServicesTable 
                services={services}
                onAddService={handleAddService}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleJobSubmit}
        craftsmanId={user.id}
      />
    </div>
  );
}