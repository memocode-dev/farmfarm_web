import {MdSensors} from "react-icons/md";
import {RiLoader3Fill, RiRefreshLine} from "react-icons/ri";
import {Button} from "@/components/ui/button";
import {useFindAllHouseSections, useSyncHouseSectionSensor} from "@/openapi/api/houses/houses";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";
import {FindAllHouseSectionsResponseHouseSectionSensor} from "@/openapi/model";
import {WiRaindrop} from "react-icons/wi";
import {Badge} from "@/components/ui/badge";
import timeSince from "@/utils/timeSince";
import {CiTempHigh} from "react-icons/ci";
import HouseSectionSensorUnit from "@/components/admin/house/section/sensor/HouseSectionSensorUnit";

interface HouseSectionSensorProps {
    houseId: string;
    houseSectionId: string;
    sensor: FindAllHouseSectionsResponseHouseSectionSensor;
}

const HouseSectionSensor = ({houseId, houseSectionId, sensor}: HouseSectionSensorProps) => {

    const [loadingSensorId, setLoadingSensorId] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>(sensor.syncStatus!);

    const {refetch: findAllHouseSectionRefetch} =
        useFindAllHouseSections(houseId, {
            query: {
                queryKey: ['HouseSectionSync', houseId, houseSectionId],
            },
        });

    const {mutateAsync: houseSectionSensorSyncToLocalDevice} = useSyncHouseSectionSensor();

    const HandleSync = async (houseSectionSensorId: string) => {
        setLoadingSensorId(houseSectionSensorId); // 로딩 스피너 표시
        toast({
            title: "하우스 동 센서 동기화 중..",
            description: "잠시만 기다려주세요.",
        });

        houseSectionSensorSyncToLocalDevice({
            houseId: houseId,
            houseSectionId: houseSectionId,
            houseSectionSensorId: houseSectionSensorId
        })

        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 이후 리패치

            const result = await findAllHouseSectionRefetch();
            const filteredSectionSensorsStatus = result.data?.houseSections?.find((section: any) => section.id === houseSectionId)?.sensors; // 해당 동 id로 상태 조회 후 업데이트
            const filteredSectionSensorSyncStatus = filteredSectionSensorsStatus?.find((sensor: any) => sensor.id === houseSectionSensorId)?.syncStatus
            setCurrentStatus(filteredSectionSensorSyncStatus!);

            if (filteredSectionSensorSyncStatus === "HEALTHY") {
                toast({
                    title: "하우스 동 센서 동기화",
                    description: "성공적으로 하우스 동 센서가 동기화되었습니다.",
                });
            }

            if (filteredSectionSensorSyncStatus !== "HEALTHY") {
                toast({
                    title: `하우스 동 센서 상태 : ${filteredSectionSensorSyncStatus}`,
                    description: "하우스 동 센서 동기화에 실패하였습니다.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('에러', error);
            toast({
                title: "하우스 동 센서 동기화 실패",
                description: "관리자에게 문의하세요.",
                variant: "destructive",
            });
        } finally {
            setLoadingSensorId("");// 로딩 스피너 끝
        }
    };

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex border-b pb-3">
                <div className="flex flex-col flex-1 space-y-3 justify-center">
                    <div className="flex flex-col space-y-0.5">
                        <div className="flex space-x-1 items-center text-sm">
                            <MdSensors className="w-4 h-4"/>
                            <div>관리자용 센서명</div>
                        </div>
                        <div className="font-bold">{sensor.nameForAdmin}</div>
                    </div>

                    <div className="flex flex-col space-y-0.5">
                        <div className="flex space-x-1 items-center text-sm">
                            <MdSensors className="w-4 h-4"/>
                            <div>사용자용 센서명</div>
                        </div>
                        <div className="font-bold">{sensor.nameForUser}</div>
                    </div>
                </div>

                <div className="flex flex-col items-center border-l pl-3">
                    <div className="text-sm">센서 동기화</div>
                    <div
                        onClick={(event) => {
                            event.stopPropagation();
                        }}>
                        {loadingSensorId === sensor.id ?
                            <RiLoader3Fill
                                className="w-7 h-7 animate-spin text-gray-400 my-1.5"/>
                            :
                            <Button
                                className="p-0"
                                variant={null}
                                onClick={() => HandleSync(sensor.id!)}
                            >
                                <RiRefreshLine
                                    className={`${currentStatus === "HEALTHY" ? 'text-primary' : 'text-gray-400'} w-6 h-6 mr-0.5`}/>
                            </Button>
                        }
                    </div>
                </div>
            </div>

            <div className="flex-1 py-5">
                {sensor.sensorModelInfo.measurementDetails?.map(({measurementType, measurementUnit}) => {
                    const measurement = sensor.measurements![measurementType!];
                    return (
                        <div className="flex flex-1">
                            <div className="flex flex-col flex-1">
                                {measurement.measurementType === "TEMPERATURE" &&
                                    <div className="flex relative h-10">
                                        <CiTempHigh className="absolute -left-3 w-12 h-12"/>
                                        <div
                                            className="absolute left-10 top-2.5 text-2xl font-semibold">{measurement.value?.toFixed(2)}</div>
                                        <HouseSectionSensorUnit measurementUnit={measurementUnit!}/>
                                        <Badge
                                            variant="outline"
                                            onClick={(event) => {event.stopPropagation();}}
                                            className="absolute right-1 top-[13px] h-fit w-fit text-sm">{timeSince(new Date(measurement.measuredAt))}</Badge>
                                    </div>
                                }

                                {measurement.measurementType === "HUMIDITY" &&
                                    <div className="flex relative h-10">
                                        <WiRaindrop className="absolute -left-4 w-14 h-16"/>
                                        <div
                                            className="absolute left-10 top-4 text-2xl font-semibold">{measurement.value?.toFixed(2)}</div>
                                        <HouseSectionSensorUnit measurementUnit={measurementUnit!}/>
                                        <Badge
                                            variant="outline"
                                            onClick={(event) => {event.stopPropagation();}}
                                            className="absolute right-1 top-[18px] h-fit w-fit text-sm">{timeSince(new Date(measurement.measuredAt))}</Badge>
                                    </div>
                                }
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default HouseSectionSensor;