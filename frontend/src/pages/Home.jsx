import Header from "../components/Header";
import Main from "../sections/Main";
import WorkWithUs from "../sections/WorkWithUs";
import Services from "../sections/Services";
import Summary from "../sections/Summary";
import Verified from "../sections/Verified";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />
      <Main />
      <WorkWithUs />
      <Verified />
      <Summary />
      <Services />
      <Footer />
    </div>
  );
}