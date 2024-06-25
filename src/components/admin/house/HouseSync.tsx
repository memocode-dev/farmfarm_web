import {toast} from "@/components/ui/use-toast";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {RiLoader3Fill, RiRefreshLine} from "react-icons/ri";
import {useFindAllHouses, useSyncHouse} from "@/openapi/api/houses/houses";

interface HouseSyncProps {
    houseId: string;
    houseStatus: string;
}

const HouseSync = ({houseId, houseStatus}: HouseSyncProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentStatus, setCurrentStatus] = useState<string>(houseStatus);

    const {data: housesArrayData, refetch: findAllHousesRefetch} =
        useFindAllHouses({
            query: {
                queryKey: ['Houses', houseId],
            },
        });

    const {mutateAsync: houseSyncToLocalDevice} = useSyncHouse();

    const HandleSync = async () => {
        setIsLoading(true); // 로딩 스피너 표시
        toast({
            title: "하우스 동기화 중..",
            description: "잠시만 기다려주세요.",
        });

        houseSyncToLocalDevice({
            houseId: houseId
        })

        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 이후 리패치

            const result = await findAllHousesRefetch();
            const filteredStatus = result.data?.houses?.find((house: any) => house.id === houseId)?.syncStatus; // 해당 동 id로 상태 조회 후 업데이트
            setCurrentStatus(filteredStatus!);

            if (filteredStatus === "HEALTHY") {
                toast({
                    title: "하우스 동기화",
                    description: "성공적으로 하우스가 동기화되었습니다.",
                });
            }

            if (filteredStatus !== "HEALTHY") {
                toast({
                    title: `하우스 상태 : ${filteredStatus}`,
                    description: "하우스 동기화에 실패하였습니다.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('에러', error);
            toast({
                title: "하우스 동기화 실패",
                description: "관리자에게 문의하세요.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // 로딩 스피너 끝
        }
    };

    return (
        <div className="flex"
             onClick={(event) => {
                 event.stopPropagation();
             }}>
            {isLoading ?
                <RiLoader3Fill className="w-7 h-7 animate-spin text-gray-400 my-1.5"/>
                :
                <Button
                    variant="ghost"
                    onClick={HandleSync}
                    className="p-0"
                >
                    <RiRefreshLine className={`${currentStatus === "HEALTHY" ? 'text-primary' : 'text-gray-400'} w-6 h-6`}/>
                </Button>
            }
        </div>
    );
}

export default HouseSync;
