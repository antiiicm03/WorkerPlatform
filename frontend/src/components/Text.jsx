export default function Text({ type, value }) {
  if (type === "heading") {
    return (
      <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
        {value}
      </h1>
    );
  } else if (type === "primary") {
    return (
      <p className="text-lg text-white leading-relaxed">
        {value}
      </p>
    );
  } else if (type === "secondary") {
    return (
      <p className="text-lg text-gray-300 leading-relaxed">
        {value}
      </p>
    );
  }
}