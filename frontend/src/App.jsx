import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseTasks from './pages/BrowseTasks';
import AboutUs from './pages/AboutUs';
import CraftsmenByCategory from './pages/CraftsmenByCategory';

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
        <Route path="/craftsmen/:category" element={<CraftsmenByCategory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;