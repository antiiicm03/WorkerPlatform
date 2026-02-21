export default function GridCard({ image, heading }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="w-full h-48 overflow-hidden">
                <img src={image} alt={heading} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="p-6">
                <h3 className="text-gray-900 font-bold text-2xl mb-4">
                    {heading}
                </h3>
                <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-[#2324fe] font-semibold hover:gap-3 transition-all duration-200 group"
                >
                    <span>Pronađi Mostera</span>
                    <svg 
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
}