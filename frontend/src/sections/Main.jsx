import Button from "../components/Button";
import Text from "../components/Text";
import Lottie from "lottie-react";
import worker from "../assets/lottie/worker.json";

export default function Main(){
    return (
        <main className="flex-1 flex flex-col text-center gap-10 md:flex-row md:text-left md:p-10 md:px-20">
            <div className="flex-1 flex flex-col items-center justify-center p-10 gap-2">
                <Text type="heading" value="Find Trusted Local Workers. Get the Job Done — Fast."></Text>
                <Text type="secondary" value="Building trust between neighbors by making local services simple, transparent, and reliable."></Text>
                <div className="w-full gap-4 mt-5 flex items-center justify-center md:justify-normal">
                    <Button type="primary" btnText="Get Started"></Button>
                    <Button type="terciary" btnText="Learn More"></Button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Lottie animationData={worker} className="max-w-[320px]"></Lottie>
            </div>
        </main>
    );
}