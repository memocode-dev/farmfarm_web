import {FindAllHouseSectionsResponseHouseSection} from "@/openapi/model";
import HouseSectionSync from "@/components/admin/house/section/HouseSectionSync";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext} from "react";
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
            <div className="flex justify-center">
                <div
                    className="py-2 px-4 text-lg font-semibold cursor-default">{houseSection.sectionNumber}동
                </div>
            </div>

            <div
                style={{aspectRatio: '3 / 5.5'}}
                className="flex flex-col justify-between bg-secondary/60 space-y-2 shadow-lg overflow-y-auto overflow-x-hidden p-3">

                <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                        <div className="font-semibold cursor-default">하우스 동 동기화</div>
                        <HouseSectionSync
                            houseId={houseId}
                            houseSectionId={houseSection.id!}
                            houseSectionSyncStatus={houseSection.syncStatus!}
                        />
                    </div>

                    <div className="flex-1 relative overflow-y-auto">
                        <div className="absolute inset-0">
                            <>
                                <div className="py-1 font-semibold cursor-default">센서</div>
                                <div
                                    className="py-1.5 overflow-y-auto space-y-2">
                                    {houseSection.sensors?.map((sensor, index) => {
                                        return (
                                            <div key={index}
                                                 className="flex border bg-secondary rounded py-2 px-3 cursor-pointer"
                                                 onClick={() => openModal({
                                                     name: ModalTypes.HOUSE_SECTION_SENSOR_UPDATE,
                                                     data: {
                                                         houseId: houseId,
                                                         houseSectionId: houseSection.id,
                                                         sensor: sensor
                                                     }
                                                 })}
                                            >
                                                <HouseSectionSensor
                                                    houseId={houseId}
                                                    houseSectionId={houseSection.id!}
                                                    sensor={sensor}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        </div>
                    </div>

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
        </>
    )
}

export default HouseSection;