import {RiCelsiusLine, RiPercentLine} from "react-icons/ri";

interface HouseSectionSensorUnitProps {
    measurementUnit: string;
}

const HouseSectionSensorUnit = ({measurementUnit}: HouseSectionSensorUnitProps) => {
    return (
        <div className="flex">
            {measurementUnit === "CELSIUS" &&
                <div className="flex relative h-10">
                    <RiCelsiusLine className="absolute left-[110px] top-[17px] w-5 h-5"/>
                </div>
            }
            {measurementUnit === "PERCENT" &&
                <div className="flex relative h-10">
                    <RiPercentLine className="absolute left-[110px] top-[21px] w-5 h-5"/>
                </div>
            }
        </div>
    )
}

export default HouseSectionSensorUnit;