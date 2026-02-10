import { Link } from "react-router-dom";

export default function Button({ type, btnText, to }) {
  if (type === "primary") {
    return (
      <Link to={to || "/"}>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
          {btnText}
        </button>
      </Link>
    );
  } else if (type === "secondary") {
    return (
      <Link to={to || "/"}>
        <button className="bg-transparent border-2 border-blue-600 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
          {btnText}
        </button>
      </Link>
    );
  } else if (type === "terciary") {
    return (
      <Link to={to || "/"}>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
          {btnText}
        </button>
      </Link>
    );
  }
}