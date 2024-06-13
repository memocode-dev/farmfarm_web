import {GreenhouseSection} from "@/openapi/model";
import {useFindAllGreenhouseSectionSensor} from "@/openapi/api/greenhouses/greenhouses";
import {Button} from "@/components/ui/button";
import {MdSensors} from "react-icons/md";
import {PiCubeLight} from "react-icons/pi";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import GreenHouseSectionSync from "@/components/admin/greenHouse/section/GreenHouseSectionSync";

interface GreenhouseSectionProps {
    green_house_section: GreenhouseSection;
    greenHouseId: string;
}

const GreenHouseSection = ({
                               green_house_section, greenHouseId,
                           }: GreenhouseSectionProps) => {

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
                className="flex flex-col scale-100 h-[330px] bg-secondary/60 space-y-2 hover:cursor-pointer shadow-lg overflow-y-auto overflow-x-hidden p-3">

                <div className="flex justify-between items-center">
                    <div className="font-extrabold text-sm">하우스 동 동기화</div>
                    <GreenHouseSectionSync
                        greenHouseId={greenHouseId}
                        greenHouseSectionId={green_house_section.id}
                        greenHouseSectionStatus={green_house_section.status!}
                    />
                </div>

                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger
                            className="font-extrabold text-sm py-2 hover:no-underline">센서</AccordionTrigger>
                        <AccordionContent className="py-1.5 max-h-[186px] overflow-y-auto space-y-2">
                            {green_house_section_sensors?.map((green_house_section_sensor, index) => {
                                return (
                                    <div key={index} className="flex flex-col border bg-secondary rounded p-1">
                                        <div className="flex space-x-1 items-center font-semibold text-sm">
                                            <MdSensors className="w-4 h-4"/>
                                            <div className="font-semibold">센서</div>
                                            <div>{green_house_section_sensor.adminName}</div>
                                        </div>

                                        <div className="flex space-x-1 items-center font-semibold text-sm">
                                            <PiCubeLight className="w-4 h-4"/>
                                            <div className="font-semibold">센서 모델</div>
                                            <div>{green_house_section_sensor.sensorModel.modelName}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-none">
                        <AccordionTrigger
                            className="font-extrabold text-sm py-2 hover:no-underline">제어</AccordionTrigger>
                        <AccordionContent className="py-1.5 max-h-[186px] overflow-y-auto space-y-4">
                            <div>준비중입니다..</div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}

export default GreenHouseSection;