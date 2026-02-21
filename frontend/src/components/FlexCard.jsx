import Text from "./Text";

export default function Card({ image, icon, heading, text }) {
    return (
        <div className="flex-1 p-5">
            <div className="w-full h-64 overflow-hidden rounded-xl">
                <img src={image} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="flex items-center gap-3 pt-5 pb-3">
                <img src={icon} alt="" className="w-10 h-10"/>
                <Text type="cardHeading" value={heading}/>
            </div>
            <Text type="primary" value={text}/>
        </div>
    );
}