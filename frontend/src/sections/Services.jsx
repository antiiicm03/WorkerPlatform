import Text from "../components/Text";
import Card from "../components/GridCard";
import plumber from "../assets/plumber.jpg";
import workerTwo from "../assets/workerTwo.jpg";
import workerThree from "../assets/workerThree.jpg";
import workerFour from "../assets/workerFour.jpg";
import workerFive from "../assets/workerFive.jpg";
import workerSix from "../assets/workerSix.jpg";
import workerSeven from "../assets/workerSeven.jpg";
import workerEight from "../assets/workerEight.jpg";
import workerNine from "../assets/workerNine.jpg";

export default function Services() {
    return (
        <main className="bg-[#2324fe] pt-12">
            <div className="text-center">
                <Text type="heading" value="Dostupni Servisi" />
            </div>
            <div className="p-10 mt-10 gap-10 grid md:grid-cols-3">
                <Card image={plumber}     heading="Vodoinstalater"   slug="plumbers" />
                <Card image={workerTwo}   heading="Električar"        slug="electricians" />
                <Card image={workerThree} heading="Majstor za sve"    slug="handymen" />
                <Card image={workerFour}  heading="Moler"             slug="painters" />
                <Card image={workerFive}  heading="Montaža nameštaja" slug="furniture-assembly" />
                <Card image={workerSix}   heading="Klima uređaji"     slug="air-conditioning" />
                <Card image={workerSeven} heading="Montaža TV-a"      slug="tv-mounting" />
                <Card image={workerEight} heading="Automehaničar"     slug="auto-mechanics" />
                <Card image={workerNine}  heading="Opšta pomoć"       slug="general-help" />
            </div>
        </main>
    );
}