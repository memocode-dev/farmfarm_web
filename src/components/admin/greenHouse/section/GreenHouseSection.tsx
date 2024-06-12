import {GreenhouseSection, GreenhouseSectionSensorCreateForm} from "@/openapi/model";
import {useFindAllGreenhouseSectionSensor} from "@/openapi/api/greenhouses/greenhouses";
import {Button} from "@/components/ui/button";
import {MdSensors} from "react-icons/md";
import {GrUserAdmin} from "react-icons/gr";
import {PiCubeLight} from "react-icons/pi";
import {LiaTemperatureHighSolid} from "react-icons/lia";
import {WiRaindrop, WiThermometer} from "react-icons/wi";
import {TbCategory2} from "react-icons/tb";

interface GreenhouseSectionProps {
    green_house_section: GreenhouseSection;
    greenHouseId: string;
}

const GreenHouseSection = ({green_house_section, greenHouseId}: GreenhouseSectionProps) => {

    const {isError, isLoading, data: green_house_section_sensors, refetch: findAllGreenhouseSectionSensorRefetch} =
        useFindAllGreenhouseSectionSensor(greenHouseId, green_house_section.id, {
            query: {
                queryKey: ['GreenHouseSection', green_house_section.id],
            },
        });

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllGreenhouseSectionSensorRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-center mb-2 cursor-default">
                <div
                    className="rounded-full bg-secondary/60 py-2 px-4 font-semibold">{green_house_section.sectionNumber}동
                </div>
            </div>
            <div
                className="flex flex-col scale-100 h-[330px] bg-secondary/75 hover:cursor-pointer shadow-lg overflow-y-auto overflow-x-hidden space-y-4 p-4">
                {green_house_section_sensors?.map((green_house_section_sensor, index) => {
                    return (
                        <div key={index} className="flex flex-col">
                            <div className="flex space-x-1 items-center font-semibold text-sm mb-1">
                                <MdSensors className="w-4 h-4"/>
                                <div className="font-bold">센서</div>
                                <div>{green_house_section_sensor.adminName}</div>
                            </div>

                            <div className="flex space-x-1 items-center font-semibold text-sm mb-1">
                                <PiCubeLight className="w-4 h-4"/>
                                <div className="font-bold">센서 모델</div>
                                <div>{green_house_section_sensor.sensorModel.modelName}</div>
                            </div>

                            <div className="flex space-x-1 items-center font-semibold text-sm mb-1">
                                <TbCategory2 className="w-4 h-4"/>
                                <div className="font-bold">센서 타입</div>

                                <div className="flex items-center font-semibold text-sm">
                                    {green_house_section_sensor.sensorModel.measurementTypes.map((type) => {
                                        return (
                                            <div className="flex justify-center">
                                                <div>{type.type}</div>
                                                {type.type === "temperature" && <WiThermometer className="w-6 h-6"/>}
                                                {type.type === "humidity" && <WiRaindrop className="w-6 h-6"/>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default GreenHouseSection;