export default function Text({type, value}) {
    if(type==="heading"){
        return (
            <h1 className="text-white font-bold text-5xl leading-tight">{value}</h1>
        );
    }
    else if(type==="primary"){
        return (
            <p className="text-md text-white pt-5">{value}</p>
        )
    }
    else if(type==="secondary"){
        return (
            <p className="text-md font-light text-[#5c6b82] pt-5">{value}</p>
        )
    }
}