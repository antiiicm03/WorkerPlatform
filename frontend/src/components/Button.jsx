import Lottie from "lottie-react";
import arrowRight from "../assets/lottie/arrowRight.json";

export default function Button({ type, btnText }) {
  if (type === "primary") {
    return (
      <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50">
        {btnText}
      </button>
    );
  } else if (type === "secondary") {
    return (
      <button className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-gray-600 hover:border-blue-500 rounded-lg transition-all hover:bg-gray-800/50">
        {btnText}
      </button>
    );
  } else if (type === "terciary") {
    return (
      <button className="flex items-center gap-2 px-6 py-3 bg-transparent text-white font-semibold hover:text-blue-400 transition-all group">
        <span>{btnText}</span>
        <Lottie animationData={arrowRight} loop={true} className="w-10 h-10 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }
}