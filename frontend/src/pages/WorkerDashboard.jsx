import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkerProfile from "../components/WorkerProfile";
import ServicesTable from "../components/ServicesTable";
import AddJobModal from "../components/AddJobModal";
import api from "../services/api";

export default function WorkerDashboard() {
  // TODO: Get actual craftsman ID from auth context/session
  const CRAFTSMAN_ID = 1; // Hardcoded for now

  const [workerData, setWorkerData] = useState({
    username: "majstor_petar",
    firstName: "Petar",
    lastName: "Petrović",
    email: "petar@example.com",
    phone: "+381 64 123 4567",
    profession: "Vodoinstalater",
    experience: "8 godina",
    expertise: "Vodoinstalacije, grejanje, klimatizacija",
    workingHours: "Pon-Pet: 8:00-17:00",
    pricePerHour: 2000
  });

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Replace with getJobOrdersByCraftsman when backend endpoint is ready
      // For now, this will fail - you need to create the backend endpoint
      const response = await api.getJobOrdersByCraftsman(CRAFTSMAN_ID);
      
      // Transform backend data to match frontend format
      const jobs = response.data || response;
      setServices(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Greška pri učitavanju poslova');
      // Keep empty array on error so UI doesn't break
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    // TODO: Hit backend endpoint to update profile
    console.log("Updating profile:", updatedData);
    setWorkerData(updatedData);
    // await api.updateWorkerProfile(updatedData);
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
      
      // Show success message (you can use a toast library here)
      alert('Posao uspešno dodat!');
    } catch (err) {
      console.error('Error creating job:', err);
      throw err; // Re-throw to let modal handle the error
    }
  };

  return (
    <div className="min-h-screen bg-[#121418] flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Quick Actions Bar */}
          <div className="mb-6 flex justify-end">
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
        craftsmanId={CRAFTSMAN_ID}
      />
    </div>
  );
}