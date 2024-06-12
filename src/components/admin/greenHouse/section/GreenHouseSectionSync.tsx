import {GrSync} from "react-icons/gr";
import {toast} from "@/components/ui/use-toast";
import {useSyncGreenhouseSection} from "@/openapi/api/sync-greenhouses/sync-greenhouses";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";
import {Button} from "@/components/ui/button";

interface GreenHouseSectionSyncProps {
    greenHouseId: string;
    status: String;
    greenHouseSectionId: string;
}

const GreenHouseSectionSync = ({greenHouseId, greenHouseSectionId, status}: GreenHouseSectionSyncProps) => {

    const [isSync, setIsSync] = useState(false);

    const handleToggle = () => {
        setIsSync(!isSync);

        if (!isSync) {
            HandleSubmit();
        }
    };

    const handleUnSync = () => {
        setIsSync(false);
        // 동기화 해제 api 연결 추가하기
    };

    const handleSync = () => {
        setIsSync(true);
        HandleSubmit();
    };

    const HandleSubmit = () => greenHouseSectionSyncToLocalDevice({
        greenhouseId: greenHouseId,
        greenhouseSectionId: greenHouseSectionId,
    })

    const {mutate: greenHouseSectionSyncToLocalDevice} = useSyncGreenhouseSection({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "하우스 동 동기화",
                    description: "성공적으로 하우스 동이 동기화되었습니다.",
                })
            },
            onError: (error) => {
                console.log(error);
                toast({
                    title: "하우스 동 동기화 실패",
                    description: "에러 내용 표시",
                    variant: "destructive",
                })
            },
        }
    })

    return (
        <div
            className="flex items-center -space-x-1"
            onClick={(event) => {
                event.stopPropagation()
            }}>
            <Button
                disabled={status !== "HEALTHY"}
                variant={null}
                onClick={handleUnSync}
                className="p-1">
                <div className="relative">
                    <div className="absolute top-[6px] -left-[2px] block -rotate-[40deg]">
                        <div className="p-[0.5px] w-[20px] bg-white"></div>
                        <div
                            className={`p-[1px] w-[20px] ${!isSync && status === "HEALTHY" ? 'bg-primary' : 'bg-[#384252]'}`}></div>
                        <div className="p-[0.5px] w-[20px] bg-white"></div>
                    </div>
                    <GrSync
                        className={`w-[16px] h-[16px] ${!isSync && status === "HEALTHY" ? 'text-primary' : 'text-[#384252]'}`}/>
                </div>
            </Button>

            <Switch id="greenHouseSync"
                    disabled={status !== "HEALTHY"}
                    checked={isSync}
                    onCheckedChange={handleToggle}
                    className="scale-75 m-0"/>

            <Button
                disabled={status !== "HEALTHY"}
                variant={null}
                onClick={handleSync}
                className="p-1">
                <GrSync className={`w-[16px] h-[16px] ${isSync ? 'text-primary' : 'text-[#384252]'}`}/>
            </Button>
        </div>
    )
}

export default GreenHouseSectionSync;