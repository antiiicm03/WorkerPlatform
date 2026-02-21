import Text from "../components/Text";
import Card from "../components/FlexCard";
import plumber from "../assets/plumber.jpg"
import handyman from "../assets/handyman.jpg"
import construction from "../assets/construction.jpg"
import icon from "../assets/majstorijaLogoIcon.png"

export default function WorkWithUsSection() {
    return (
        <section className="bg-[#2f2c3d] py-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="text-center mb-14">
                    <Text type="heading" value="Zašto raditi sa Majstorija?"/>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                    <Card 
                        image={plumber} 
                        icon={icon} 
                        heading="Sam svoj gazda"
                        text="Biraš svoje radno vreme, područje rada, količinu rada i cenu po satu. Mi smo tu da ti obezbedimo klijente, bez skrivenih troškova, avansa i članarine."
                    />

                    <Card 
                        image={handyman} 
                        icon={icon} 
                        heading="Fleksibilan rad"
                        text="Detetu ti je rođendan, želiš sa društvom na putovanje ili sa partnerom na večeru? Nemoj da propuštaš. Posao može da čeka, a zadovoljni Mosteri su naš prioritet."
                    />

                    <Card 
                        image={construction} 
                        icon={icon} 
                        heading="Kvalitetna podrška"
                        text="Prijateljska podrška kada god ti je potrebna – sedam dana u nedelji. Zajedno rešavamo i najizazovnije probleme."
                    />
                </div>
            </div>
        </section>
    );
}