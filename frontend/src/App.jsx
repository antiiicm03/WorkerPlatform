import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './components/ContactUs';
import Login from './components/Login';
import Register from './components/Register';
import BrowseTasks from './components/BrowseTasks';
import AboutUs from './components/AboutUs';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;