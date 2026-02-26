import Lottie from "lottie-react";
import Text from "../components/Text";
import VerifiedIcon from "../assets/lottie/Verified.json";
import Button from "../components/Button";

export default function Verified() {
    return (
        <div className="p-5 bg-white flex flex-col justify-between items-center">
            <div className="flex-1 items-center justify-center flex">
                <Lottie animationData={VerifiedIcon} className="max-w-[200px]"></Lottie>
            </div>
            <div className="p-5 text-justified md:flex md:flex-col md:justify-center md:items-center text-center">
                <Text type="subHeadingBlack" value="Registrujte se danas i proširite vaša iskustva."></Text>
            </div>
            <div className="my-4">
                <Button type="primary" btnText="Saznaj Više"></Button>
            </div>
        </div>
    )
}