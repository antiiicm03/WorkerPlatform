import Text from "../components/Text";
import Painter from "../assets/lottie/painter.json";
import Builder from "../assets/lottie/Builder.json";
import Lottie from "lottie-react";
import Button from "../components/Button";

export default function Summary() {
    return (
        <div className="wrap pb-10 bg-[#262431] md:px-20">
            <div className="p-5 bg-[#262431] md:flex flex-row-reverse">
                <div className="p-5 text-justified md:flex-1 md:flex md:flex-col md:justify-center md:items-center">
                    <Text type="subHeading" value="Start using Leno today to achieve your long term Goals"></Text>
                    <Text type="primary" value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis aperiam voluptatibus libero accusamus illo asperiores dolor rerum quibusdam optio!"></Text>
                    <div className="w-full mt-8">
                        <Button type="primary" btnText="Learn More"></Button>
                    </div>
                </div>
                <div className="flex justify-center items-center md:flex-1">
                    <Lottie animationData={Painter} className="max-w-[400px] md:max-w-[500px]"></Lottie>
                </div>
            </div>
            <div className="p-5 bg-[#262431] md:flex">
                <div className="p-5 text-justified md:flex-1 md:flex md:flex-col md:justify-center md:items-center">
                    <Text type="subHeading" value="The Calendar feature helps you organize tasks"></Text>
                    <Text type="primary" value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis aperiam voluptatibus libero accusamus illo asperiores dolor rerum quibusdam optio! Lorem ipsum dolor sit amet consectetur adipisicing."></Text>
                    <div className="w-full mt-8">
                        <Button type="primary" btnText="Learn More"></Button>
                    </div>
                </div>
                <div className="flex justify-center items-center md:flex-1">
                    <Lottie animationData={Builder} className="max-w-[300px] md:max-w-[400px]"></Lottie>
                </div>
            </div>
        </div>
    )
}