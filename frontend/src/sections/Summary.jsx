import Text from "../components/Text";
import Painter from "../assets/lottie/painter.json";
import Builder from "../assets/lottie/Builder.json";
import Lottie from "lottie-react";
import Button from "../components/Button";

export default function Summary() {
    return (
        <div className="mx-auto max-w-7xl wrap pb-10 md:px-20">
            <div className="p-5 md:flex flex-row-reverse">
                <div className="p-5 text-justified md:flex-1 md:flex md:flex-col md:justify-center md:items-center">
                    <Text type="subHeading" value="Pronađi majstore lako i brzo uz Majstorija web aplikacju"></Text>
                    <Text type="primary" value="Pronađi lokalne majstore za sve vrste poslova i poveži se sa pouzdanim stručnjacima brzo i jednostavno."></Text>
                    <div className="w-full mt-8">
                        <Button type="primary" btnText="Saznaj više" to="/about"></Button>
                    </div>
                </div>
                <div className="flex justify-center items-center md:flex-1">
                    <Lottie animationData={Painter} className="max-w-[400px] md:max-w-[500px]"></Lottie>
                </div>
            </div>
            <div className="p-5 md:flex">
                <div className="p-5 text-justified md:flex-1 md:flex md:flex-col md:justify-center md:items-center">
                    <Text type="subHeading" value="Organizuj svoje projekte bez stresa"></Text>
                    <Text type="primary" value="Planiraj termine, beleži radne zadatke i prati napredak svojih projekata, kako bi sve išlo glatko i bez stresa."></Text>
                    <div className="w-full mt-8">
                        <Button type="primary" btnText="Saznaj više" to="/about"></Button>
                    </div>
                </div>
                <div className="flex justify-center items-center md:flex-1">
                    <Lottie animationData={Builder} className="max-w-[300px] md:max-w-[400px]"></Lottie>
                </div>
            </div>
        </div>
    )
}