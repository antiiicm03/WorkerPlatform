import { useState, useEffect } from "react";
import { MessageCircle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProfile from "../components/UserProfile";
import ServicesTable from "../components/ServicesTable";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
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
      const response = await api.getUserProfile(user.id);
      const userProfile = response.data || response;
      
      setOriginalUserData(userProfile);
      
      setUserData({
        userId: userProfile.userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        location: userProfile.location || '',
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
      const response = await api.getJobOrdersByUser(user.id);
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
      const userUpdate = {
        ...originalUserData,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
        location: updatedData.location,
      };

      const response = await api.updateUser(user.id, userUpdate);
      
      if (response.success) {
        setOriginalUserData(userUpdate);
        setUserData(updatedData);
        alert('Profil uspešno ažuriran!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Greška pri ažuriranju profila: ' + err.message);
      throw err;
    }
  };

  const handleFindWorker = () => {
    navigate('/browse-tasks');
  };

  if (!userData) {
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
              <h1 className="text-2xl font-bold">Dobrodošli, {userData.firstName}!</h1>
              <p className="text-gray-400">Email: {userData.email}</p>
            </div>
            <Link to="/chat">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#2324fe] text-white rounded-lg hover:bg-[#1a1bca] transition">
                <MessageCircle className="w-5 h-5" />
                Moje Poruke
              </button>
            </Link>
          </div>

          <UserProfile 
            data={userData} 
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
                onAddService={handleFindWorker}
                buttonText="Pronađi Majstora" // Custom button text for users
                buttonIcon={<Search className="w-5 h-5" />} // Custom icon for users
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}