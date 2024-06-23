import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {FindAllHouseSectionsResponseHouseSection} from "@/openapi/model";
import HouseSectionSync from "@/components/admin/house/section/HouseSectionSync";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext} from "react";
import HouseSectionUpdateModal from "@/components/admin/house/section/HouseSectionUpdateModal";
import HouseSectionSensor from "@/components/admin/house/section/sensor/HouseSectionSensor";

interface HouseSectionProps {
    houseSection: FindAllHouseSectionsResponseHouseSection;
    houseId: string;
    onDeleteSubmit: (houseSectionId: string) => void;
}

const HouseSection = ({houseSection, houseId, onDeleteSubmit}: HouseSectionProps) => {

    const {openModal} = useContext(ModalContext);

    return (
        <>
            <div className="flex justify-center cursor-default">
                <div
                    className="py-2 px-4 font-semibold">{houseSection.sectionNumber}동
                </div>
            </div>

            <div
                style={{aspectRatio: '3 / 4'}}
                className="flex flex-col justify-between bg-secondary/60 space-y-2 hover:cursor-pointer shadow-lg overflow-y-auto overflow-x-hidden p-3">

                <div>
                    <div className="flex justify-between items-center">
                        <div className="">하우스 동 동기화</div>
                        <HouseSectionSync
                            houseId={houseId}
                            houseSectionId={houseSection.id!}
                            houseSectionSyncStatus={houseSection.syncStatus!}
                        />
                    </div>

                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger
                                className="py-2 hover:no-underline">센서</AccordionTrigger>
                            <AccordionContent
                                className="py-1.5 max-h-[100px] xs:max-h-[175px] overflow-y-auto space-y-2">
                                {houseSection.sensors?.map((sensor, index) => {
                                    return (
                                        <div key={index}
                                             className="flex justify-between border bg-secondary rounded py-2 px-3">
                                            <HouseSectionSensor
                                                houseId={houseId}
                                                houseSectionId={houseSection.id!}
                                                sensor={sensor}/>
                                        </div>
                                    )
                                })}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-none">
                            <AccordionTrigger
                                className="py-2 hover:no-underline">제어</AccordionTrigger>
                            <AccordionContent className="py-1.5 max-h-[175px] overflow-y-auto space-y-4">
                                <div>준비중입니다.</div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="flex justify-between">
                    <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            toast({
                                variant: "destructive",
                                title: "하우스 동 삭제",
                                description: "정말로 하우스 동을 삭제하시겠습니까?",
                                action: (
                                    <ToastAction
                                        onClick={() => onDeleteSubmit(houseSection.id!)}
                                        altText="HouseSectionDelete">
                                        확인
                                    </ToastAction>
                                ),
                            })
                        }}>삭제
                    </Button>

                    <Button size="sm" type="button"
                            onClick={() => openModal({
                                name: ModalTypes.HOUSE_SECTION_UPDATE,
                                data: {
                                    houseId: houseId,
                                    houseSectionId: houseSection.id,
                                    sectionNumber: houseSection.sectionNumber
                                },
                            })}
                    >
                        수정
                    </Button>
                </div>
            </div>

            <HouseSectionUpdateModal/>
        </>
    )
}

export default HouseSection;