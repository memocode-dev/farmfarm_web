import {MdSensors} from "react-icons/md";
import {PiCubeLight} from "react-icons/pi";
import {RiLoader3Fill, RiRefreshLine} from "react-icons/ri";
import {Button} from "@/components/ui/button";
import {useFindAllHouseSections, useSyncHouseSectionSensor} from "@/openapi/api/houses/houses";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";
import {FindAllHouseSectionsResponseHouseSectionSensor} from "@/openapi/model";

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
        <>
            <div className="flex flex-col">
                <div className="flex space-x-3 items-center">
                    <div className="flex space-x-1 items-center">
                        <MdSensors className="w-4 h-4"/>
                        <div>센서</div>
                    </div>
                    <div className="font-bold">{sensor.nameForUser}</div>
                </div>

                <div className="flex space-x-3 items-center">
                    <div className="flex space-x-1 items-center">
                        <PiCubeLight className="w-4 h-4"/>
                        <div>센서 모델</div>
                    </div>
                    <div className="font-bold">{sensor.sensorModelInfo?.name}</div>
                </div>
            </div>

            <div className="flex justify-center"
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
        </>
    )
}

export default HouseSectionSensor;