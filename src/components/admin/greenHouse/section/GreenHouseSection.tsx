import {GreenhouseSection} from "@/openapi/model";
import {useFindAllGreenhouseSectionSensor} from "@/openapi/api/greenhouses/greenhouses";
import {Button} from "@/components/ui/button";

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
            <div className="text-center">{green_house_section.sectionNumber}동</div>
            <div
                className="flex flex-col scale-100 bg-secondary hover:cursor-pointer shadow-lg">
                <div
                    className="flex-1 flex flex-col scale-100 min-h-[330px]">
                    {green_house_section_sensors?.map((green_house_section_sensor, index) => {
                        return (
                            <div key={index}>
                                <div>관리자 명 : {green_house_section_sensor.adminName}</div>
                                <div>센서 모델 : {green_house_section_sensor.sensorModel.modelName}</div>
                                <div>센서 측정값 조회 추가예정</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default GreenHouseSection;