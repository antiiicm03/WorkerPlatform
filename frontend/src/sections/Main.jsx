import Button from "../components/Button";
import Text from "../components/Text";
import Lottie from "lottie-react";
import worker from "../assets/lottie/worker.json";

export default function Main() {
    return (
        <main className="mx-auto max-w-7xl flex-1 flex flex-col text-center gap-10 md:flex-row md:text-left md:p-10 md:px-20">
            <div className="flex-1 flex flex-col items-center justify-center p-10 gap-2">
                <Text type="heading" value="Pronađite Pouzdane Lokalne Radnike. Završite Posao — Brzo."></Text>
                <Text type="secondary" value="Izgradnja poverenja među komšijama čineći lokalne usluge jednostavnim, transparentnim i pouzdanim."></Text>
                <div className="w-full gap-4 mt-5 flex items-center justify-center md:justify-normal">
                    <Button type="primary" btnText="Započni" to="/browse-tasks"></Button>
                    <Button type="terciary" btnText="Saznaj Više"></Button>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1">
                <Lottie animationData={worker} className="max-w-[400px]"></Lottie>
            </div>
        </main>
    );
}