import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useDeleteHouseSection, useFindAllHouseSections} from "@/openapi/api/houses/houses";
import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import HouseSectionCreateModal from "@/components/admin/house/section/HouseSectionCreateModal";
import HouseSection from "@/components/admin/house/section/HouseSection";
import {toast} from "@/components/ui/use-toast";
import HouseSectionSensorCreateModal from "@/components/admin/house/section/sensor/HouseSectionSensorCreateModal";
import HouseSectionUpdateModal from "@/components/admin/house/section/HouseSectionUpdateModal";
import HouseSectionSensorUpdateModal from "@/components/admin/house/section/sensor/HouseSectionSensorUpdateModal";
import {FindAllHouseSectionsResponseHouseSection} from "@/openapi/model";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";
import {IoIosMore} from "react-icons/io";

interface HouseSectionsProps {
    houseId: string;
}

const HouseSections = ({houseId}: HouseSectionsProps) => {

    const {openModal} = useContext(ModalContext);
    const [createdHouseSectionId, setCreatedHouseSectionId] = useState<string>(); // 새로 생성된 동 id

    const {isError, isLoading, data: houseSectionsArrayData, refetch: findAllHouseSectionsRefetch} =
        useFindAllHouseSections(houseId, {
            query: {
                queryKey: ['HouseSections', houseId],
            },
        });
    const houseSections = houseSectionsArrayData?.houseSections?.sort((a: FindAllHouseSectionsResponseHouseSection, b: FindAllHouseSectionsResponseHouseSection) => a.sectionNumber! - b.sectionNumber!)

    const {mutate: deleteHouseSection} = useDeleteHouseSection({
        mutation: {
            onSuccess: async () => {
                toast({description: "성공적으로 하우스 동이 삭제되었습니다."});
                await findAllHouseSectionsRefetch();

            },
            onError: (error) => {
                const errorData = error.response?.data as { code: string; message: string }
                if (errorData.code === "NOT_FOUND_HOUSE_SECTION") {
                    return (
                        toast({
                            variant: "destructive",
                            title: "하우스 동 삭제에 실패하였습니다.",
                            description: errorData.message,
                        })
                    )
                }
                if (errorData.code === "HOUSE_SECTION_REFERENCED") {
                    return (
                        toast({
                            variant: "destructive",
                            title: "하우스 동 삭제에 실패하였습니다.",
                            description: "해당 하우스 동에 센서가 존재합니다.",
                        })
                    )
                }

                console.log(error);
                toast({
                    variant: "destructive",
                    title: "하우스 동 삭제에 실패하였습니다.",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    })

    const onDeleteSubmit = (houseSectionId: string) => deleteHouseSection({
        houseId: houseId,
        houseSectionId: houseSectionId
    });

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllHouseSectionsRefetch()}>재시도</Button>
            </div>
        )
    }

    // 5초마다 하우스 동 전체조회
    useEffect(() => {
        const intervalId = setInterval(() => {
            findAllHouseSectionsRefetch();
        }, 5000);

        return () => clearInterval(intervalId); // 해당 페이지에서 나가면 타이머 정리
    }, [findAllHouseSectionsRefetch]);

    return (
        <>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between sm:space-y-0">
                    <CardTitle>하우스 동</CardTitle>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger
                                className="group inline-flex px-1.5 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
                                <IoIosMore className="w-5 h-5"/>
                            </MenubarTrigger>
                            <MenubarContent sideOffset={15} align="end">
                                <MenubarItem>
                                    <Button
                                        className="w-full"
                                        variant="ghost"
                                        onClick={() => openModal({
                                            name: ModalTypes.HOUSE_SECTION_CREATE,
                                            data: {
                                                houseId: houseId,
                                                setCreatedHouseSectionId: setCreatedHouseSectionId,
                                            }
                                        })}
                                    >
                                        하우스 동 생성
                                    </Button>
                                </MenubarItem>

                                <MenubarItem>
                                    <Button
                                        className="w-full"
                                        variant="ghost"
                                        onClick={() => openModal({
                                            name: ModalTypes.HOUSE_SECTION_SENSOR_CREATE,
                                            data: houseId,
                                        })}
                                    >
                                        하우스 동 센서 생성
                                    </Button>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </CardHeader>
                <CardContent>

                    {houseSections?.length === 0 &&
                        <div className="py-10 text-muted-foreground text-center">하우스 동이 없습니다.</div>
                    }

                    <div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 sm:py-5 xs:px-5">
                        {houseSections?.map((houseSection, index) => {
                            return (
                                <div
                                    className={`flex flex-col ${createdHouseSectionId === houseSection.id ? 'slide-in-up' : ''}`}
                                    key={index}>
                                    <HouseSection
                                        houseSection={houseSection}
                                        houseId={houseId}
                                        onDeleteSubmit={onDeleteSubmit}
                                    />
                                </div>
                            )
                        })}

                        {isLoading &&
                            Array.from({length: 10}, (_, index) => (
                                <Skeleton key={index} className="min-h-[500px]"/>
                            ))
                        }
                    </div>
                </CardContent>
            </Card>

            <HouseSectionCreateModal/>
            <HouseSectionSensorCreateModal/>

            <HouseSectionUpdateModal/>
            <HouseSectionSensorUpdateModal/>
        </>
    )
}

export default HouseSections;