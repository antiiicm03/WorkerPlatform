import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseTasks from './pages/BrowseTasks';
import AboutUs from './pages/AboutUs';
import WorkerDashboard from './pages/WorkerDashboard';
import WorkerChat from './pages/Chat';
import CraftsmenByCategory from './pages/CraftsmenByCategory';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import ProfileSettings from './pages/ProfileSettings';
import CraftsmanProfile from './pages/CraftsmanProfile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse-tasks" element={<BrowseTasks />} />
        <Route path="/workers/dashboard" element={<WorkerDashboard />} />
        <Route path="/workers/chat" element={<WorkerChat />} />
        <Route path="/craftsmen/:category" element={<CraftsmenByCategory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/craftsman/:id" element={<CraftsmanProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;