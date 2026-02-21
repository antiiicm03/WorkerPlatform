export default function Text({type, value}) {
    if(type==="heading"){
        return (
            <h1 className="text-white font-bold text-5xl leading-tight">{value}</h1>
        );
    }
    if(type==="subHeading"){
        return (
            <h1 className="text-white font-bold text-3xl leading-tight mb-2">{value}</h1>
        );
    }
    if(type==="subHeadingBlack"){
        return (
            <h1 className="text-black font-bold text-3xl leading-tight mb-2">{value}</h1>
        );
    }
    else if(type==="primary"){
        return (
            <p className="text-md text-white mt-3">{value}</p>
        )
    }
    else if (type === "cardHeading") {
        return <h3 className="text-white font-semibold text-xl">{value}</h3>;
    }
    else if(type==="secondary"){
        return (
            <p className="text-md font-light text-[#5c6b82] pt-5">{value}</p>
        )
    }
}