import { Link } from 'react-router-dom';
import { CheckCircle, Users, Wrench, MessageCircle } from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            O Majstoriji
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Povezujemo zajednice kroz pouzdane lokalne usluge od 2026. godine
          </p>
        </div>

        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Naša Priča</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Osnovana 2026. godine, Majstorija je nastala iz jednostavne opservacije: pronalaženje pouzdanih lokalnih servisera ne bi trebalo da bude komplikovano. Uočili smo da obični ljudi često imaju poteškoća da pronađu kvalifikovane radnike za popravke, održavanje i razne zadatke, dok talentovani profesionalci teško dopiru do potencijalnih klijenata.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Naša platforma premošćava ovaj jaz stvaranjem transparentnog i sigurnog tržišta gde korisnici lako mogu pronaći i angažovati proverene lokalne radnike za bilo koji zadatak, mali ili veliki. Bilo da vam treba vodoinstalater, električar, majstor ili pomoć pri sklapanju nameštaja, Majstorija čini proces jednostavnim i pouzdanim.
          </p>
        </div>

       
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Šta Radimo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Za Korisnike</h3>
              <p className="text-gray-300 leading-relaxed">
                Pomažemo vam da pronađete kvalifikovane profesionalce za bilo koji kućni ili poslovni zadatak. Objavite svoj posao, primajte ponude od proverenih radnika, uporedite profile i recenzije i izaberite najboljeg za posao—sve na jednom mestu.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Za Radnike</h3>
              <p className="text-gray-300 leading-relaxed">
                Omogućavamo kvalifikovanim profesionalcima platformu da razviju svoj posao, povežu se sa klijentima kojima su potrebne njihove usluge, grade reputaciju kroz recenzije i efikasno upravljaju svojim rasporedom.
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/30 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Kako Majstorija Pomaže U Svakodnevnom Životu</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Štedi Vreme</h3>
              <p className="text-gray-300">
                Nema više beskonačnog traženja ili nepouzdanih kontakata. Pronađite pravog profesionalca brzo i efikasno.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gradi Poverenje</h3>
              <p className="text-gray-300">
                Provereni radnici, transparentne recenzije i sigurni načini plaćanja stvaraju bezbedno okruženje za sve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Podržava Lokalno</h3>
              <p className="text-gray-300">
                Jača lokalne zajednice povezivanjem komšija sa kvalifikovanim profesionalcima u okolini.
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Za Koga Je Majstorija?</h2>
          <p className="text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            Majstorija je dizajnirana za sve koji trebaju pomoć sa zadacima ili žele da ponude svoje profesionalne usluge:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Vlasnici Kuća & Stanari</h3>
              <p className="text-gray-300">
                Svako kome su potrebne popravke, instalacije ili održavanje u kući.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Zaposleni Profesionalci</h3>
              <p className="text-gray-300">
                Ljudi koji nemaju vremena da sami obavljaju kućne zadatke.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Mali Biznisi</h3>
              <p className="text-gray-300">
                Kompanije kojima je potreban brz pristup pouzdanim servisima.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Kvalifikovani Radnici</h3>
              <p className="text-gray-300">
                Profesionalci koji žele da prošire bazu klijenata i razviju svoj posao.
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/30 text-center">
          <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Treba Vam Pomoć Ili Imate Pitanja?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Naš tim za podršku je ovde da vam pomogne. Slobodno nas kontaktirajte u bilo koje vreme.
          </p>
          <Link to="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
              Kontaktirajte Naš Servis
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;