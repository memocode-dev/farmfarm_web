import {toast} from "@/components/ui/use-toast";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {RiLoader3Fill, RiRefreshLine} from "react-icons/ri";
import {useFindAllHouseSections, useSyncHouseSection} from "@/openapi/api/houses/houses";

interface HouseSectionSyncProps {
    houseId: string;
    houseSectionId: string;
    houseSectionSyncStatus: string;
}

const HouseSectionSync = ({
                              houseId,
                              houseSectionId,
                              houseSectionSyncStatus,
                          }: HouseSectionSyncProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentStatus, setCurrentStatus] = useState<string>(houseSectionSyncStatus);

    const {refetch: findAllHouseSectionRefetch} =
        useFindAllHouseSections(houseId, {
            query: {
                queryKey: ['HouseSectionSync', houseId, houseSectionId],
            },
        });

    const {mutateAsync: houseSectionSyncToLocalDevice} = useSyncHouseSection();

    const HandleSync = async () => {
        setIsLoading(true); // 로딩 스피너 표시
        toast({
            title: "하우스 동 동기화 중..",
            description: "잠시만 기다려주세요.",
        });

        houseSectionSyncToLocalDevice({
            houseId: houseId,
            houseSectionId: houseSectionId,
        })

        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 이후 리패치

            const result = await findAllHouseSectionRefetch();
            const filteredSectionStatus = result.data?.houseSections?.find((section: any) => section.id === houseSectionId)?.syncStatus; // 해당 동 id로 상태 조회 후 업데이트
            setCurrentStatus(filteredSectionStatus!);

            if (filteredSectionStatus === "HEALTHY") {
                toast({
                    title: "하우스 동 동기화",
                    description: "성공적으로 하우스 동이 동기화되었습니다.",
                });
            }

            if (filteredSectionStatus !== "HEALTHY") {
                toast({
                    title: `하우스 동 상태 : ${filteredSectionStatus}`,
                    description: "하우스 동 동기화에 실패하였습니다.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('에러', error);
            toast({
                title: "하우스 동 동기화 실패",
                description: "관리자에게 문의하세요.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // 로딩 스피너 끝
        }
    };

    return (
        <div className="flex justify-center"
             onClick={(event) => {
                 event.stopPropagation();
             }}>
            {isLoading ?
                <RiLoader3Fill className="w-7 h-7 animate-spin text-gray-400 my-1.5"/>
                :
                <Button
                    className="p-0"
                    variant={null}
                    onClick={HandleSync}
                >
                    <RiRefreshLine className={`${currentStatus === "HEALTHY" ? 'text-primary' : 'text-gray-400'} w-7 h-7 mr-0.5`}/>
                </Button>
            }
        </div>
    );
}

export default HouseSectionSync;
