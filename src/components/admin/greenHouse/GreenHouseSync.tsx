import {GrSync} from "react-icons/gr";
import {toast} from "@/components/ui/use-toast";
import {useSyncGreenhouse} from "@/openapi/api/sync-greenhouses/sync-greenhouses";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";
import {Button} from "@/components/ui/button";

interface GreenHouseSyncProps {
    greenHouseId: string;
    status: String;
}

const GreenHouseSync = ({greenHouseId, status}: GreenHouseSyncProps) => {

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

    const HandleSubmit = () => greenHouseSyncToLocalDevice({
        greenhouseId: greenHouseId
    })

    const {mutate: greenHouseSyncToLocalDevice} = useSyncGreenhouse({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "하우스 동기화",
                    description: "성공적으로 하우스가 동기화되었습니다.",
                })
            },
            onError: (error) => {
                console.log(error);
                toast({
                    title: "하우스 동기화 실패",
                    description: "에러 내용 표시",
                    variant: "destructive",
                })
            },
        }
    })

    return (
        <div
            className="flex p-2 items-center space-x-1.5"
            onClick={(event) => {
                event.stopPropagation()
            }}>
            <Button
                disabled={status !== "HEALTHY"}
                variant={null}
                onClick={handleUnSync}
                className="px-1`">
                <div className="relative">
                    <div className="absolute top-[8px] -left-[3px] block -rotate-[40deg]">
                        <div className="bg-white p-[0.5px] w-[26px]"></div>
                        <div
                            className={`p-[1px] w-[26px] ${!isSync && status === "HEALTHY" ? 'bg-primary' : 'bg-[#384252]'}`}></div>
                        <div className="bg-white p-[0.5px] w-[26px]"></div>
                    </div>
                    <GrSync
                        className={`w-5 h-5 ${!isSync && status === "HEALTHY" ? 'text-primary' : 'text-[#384252]'}`}/>
                </div>
            </Button>

            <Switch id="greenHouseSync"
                    disabled={status !== "HEALTHY"}
                    checked={isSync}
                    onCheckedChange={handleToggle}/>

            <Button
                disabled={status !== "HEALTHY"}
                variant={null}
                onClick={handleSync}
                className="px-1`">
                <GrSync className={`w-5 h-5 ${isSync ? 'text-primary' : 'text-[#384252]'}`}/>
            </Button>
        </div>
    )
}

export default GreenHouseSync;