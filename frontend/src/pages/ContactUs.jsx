import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Poruka poslata! (Backend još nije povezan)');
  };

  const teamMembers = [
    { name: 'Aleksandar Radovanović', role: 'Full Stack Developer' },
    { name: 'Stefan Filipović', role: 'Frontend Developer' },
    { name: 'Mihajlo Antić', role: 'Backend Developer' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Kontaktirajte Nas
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Imate pitanje, sugestiju ili vam je potrebna pomoć? Slobodno nam se obratite — odgovorićemo što je pre moguće.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Pošaljite Nam Poruku</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Puno Ime *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Unesite vaše puno ime"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Email Adresa *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="vas.email@primer.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Naslov *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="O čemu se radi?"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Poruka *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Napišite vašu poruku ovde..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center space-x-2 group"
              >
                <span>Pošaljite Poruku</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-gray-400 text-center">
                🔒 Vaši podaci su sigurni i neće biti deljeni.
              </p>
            </form>
          </div>

          <div className="space-y-8">
           
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Kontakt Informacije</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a href="mailto:majstorija.service@yahoo.com" className="text-gray-300 hover:text-blue-400 transition">
                      majstorija.service@yahoo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Telefon</h3>
                    <a href="tel:+381601234567" className="text-gray-300 hover:text-blue-400 transition">
                      +381 60 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Lokacija</h3>
                    <p className="text-gray-300">Srbija</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-4">⏰ Radno Vreme</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Ponedeljak – Petak:</span>
                  <span className="font-semibold text-white">09:00 – 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Vikend:</span>
                  <span className="font-semibold text-gray-400">Zatvoreno</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Naš Tim</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-blue-500 transition-all hover:transform hover:scale-105"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-center font-medium">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Pronađite Nas</h2>
          <div className="w-full h-96 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.123456789!2d20.46278!3d44.8176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a65b6a1234567%3A0xabcdef123456789!2sDorćol%2C%20Beograd%2C%20Srbija!5e0!3m2!1sen!2srs!4v1700000000000!5m2!1sen!2srs"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Majstorija Location"
              ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;