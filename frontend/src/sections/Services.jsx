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


export default function WorkWithUsSection() {
    return (
        <main className="bg-[#2324fe] pt-12">
            <div className="text-center">
                <Text type="heading" value="Dostupni Servisi"></Text>
            </div>
            <div className="p-10 mt-10 gap-10 grid md:grid-cols-3">
                <Card image={plumber} heading="Vodoinstalater" />
                <Card image={workerTwo} heading="Elektricar" />
                <Card image={workerThree} heading="Cistac" />
                <Card image={workerFour} heading="Moler" />
                <Card image={workerFive} heading="Keramicar" />
                <Card image={workerSix} heading="Stolar" />
                <Card image={workerSeven} heading="Bravar" />
                <Card image={workerEight} heading="Limар" />
                <Card image={workerNine} heading="Automehanicar" />
            </div>
        </main>
    );
}