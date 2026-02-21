import majstorijaLogoMain from "../assets/majstorijaLogoMain.png";
import Navbar from "../components/Navbar";

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between p-6 md:p-10 relative z-50">
        <div>
            <img src={majstorijaLogoMain} alt="logoMajstorija" className="max-w-[200px]"/>
        </div>
        <Navbar />
    </header>
  );
}