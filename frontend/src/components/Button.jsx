import Lottie from "lottie-react";
import arrowRight from "../assets/lottie/arrowRight.json";

export default function Button({type, btnText}) {
    if (type==="primary") {
        return (
            <button className="px-5 py-2 bg-[#2324fe] text-center text-white">{btnText}</button>
        );
    }
    else if (type==="secondary") {
        return (
            <button className="px-5 py-2 bg-transparent text-center text-white border-[1px] border-[#3b3c40]">{btnText}</button>
        );
    }
    else if (type==="terciary") {
        return (
            <div className="wrap flex items-center justify-center">
                <Lottie animationData={arrowRight} loop={true} className="w-[40px]"></Lottie>
                <button className="bg-transparent text-center text-white">{btnText}</button>
            </div>
        );
    }
}