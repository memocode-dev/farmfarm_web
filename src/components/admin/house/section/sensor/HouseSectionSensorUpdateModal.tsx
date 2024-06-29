import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {
    useDeleteHouseSectionSensor,
    useFindAllHouseSections,
    useUpdateHouseSectionSensor
} from "@/openapi/api/houses/houses";
import {FindAllHouseSectionsResponseHouseSectionSensor, UpdateHouseSectionSensorForm} from "@/openapi/model";
import {Skeleton} from "@/components/ui/skeleton";
import {ToastAction} from "@/components/ui/toast";
import {Separator} from "@/components/ui/separator";
import {RiCelsiusLine, RiPercentLine} from "react-icons/ri";
import HouseSectionSensorGraph from "@/components/admin/house/section/sensor/HouseSectionSensorGraph";

const HouseSectionSensorUpdateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>()
    const [houseSectionId, setHouseSectionId] = useState<string>()
    const [sensor, setSensor] = useState<FindAllHouseSectionsResponseHouseSectionSensor>()

    const {isLoading, refetch} =
        useFindAllHouseSections(houseId!, {
            query: {
                queryKey: ['HouseSections', houseId],
            },
        });

    const {
        mutate: updateHouseSectionSensor,
    } = useUpdateHouseSectionSensor({
        mutation: {
            onSuccess: async () => {
                toast({
                    title: "하우스 동 센서 수정",
                    description: "성공적으로 하우스 동 센서가 수정되었습니다.",
                })
                closeModal({
                    name: ModalTypes.HOUSE_SECTION_SENSOR_UPDATE
                });
                await refetch();
            },
            onError: (error) => {
                console.log(error)
                toast({
                    variant: "destructive",
                    title: "하우스 동 센서 수정에 실패하였습니다.",
                    description: "관리자에게 문의하세요."
                });
            },
        }
    });

    const {mutate: deleteHouseSectionSensor} = useDeleteHouseSectionSensor({
        mutation: {
            onSuccess: async () => {
                toast({description: "성공적으로 하우스 동 센서가 삭제되었습니다."})
                closeModal({
                    name: ModalTypes.HOUSE_SECTION_SENSOR_UPDATE
                });
                await refetch();
            },
            onError: (error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "하우스 동 센서 삭제에 실패하였습니다.",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    })

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<UpdateHouseSectionSensorForm>();

    const onUpdateSubmit = (data: UpdateHouseSectionSensorForm) => {
        updateHouseSectionSensor({
            houseId: houseId!,
            houseSectionId: houseSectionId!,
            houseSectionSensorId: sensor?.id!,
            data: data
        });
    }

    const onDeleteSubmit = () => {
        deleteHouseSectionSensor({
            houseId: houseId!,
            houseSectionId: houseSectionId!,
            houseSectionSensorId: sensor?.id!,
        });
    }

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.data.houseId)
            setHouseSectionId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.data.houseSectionId)

            const sensor = modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.data.sensor
            setSensor(sensor)

            reset({
                portName: sensor.portName,
                nameForUser: sensor.nameForUser,
                nameForAdmin: sensor.nameForAdmin,
            })
        }

        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.isVisible === false) {
            reset()
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_SECTION_SENSOR_UPDATE
                    });
                }
            }}
        >
            <DialogContent className="rounded-lg max-w-[90%] h-[90%] w-[600px] p-0 sm:p-6">
                <DialogHeader className="px-6 pt-6 sm:p-0">
                    <DialogTitle>하우스 동 센서 정보</DialogTitle>
                    <DialogDescription>
                        하우스 동 센서의 정보를 확인하고, 수정할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[100%] overflow-y-auto px-3">
                    <form className="flex flex-col py-[10px] space-y-7">
                        {!isLoading && sensor &&
                            <>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="id">Id</Label>
                                    <Input disabled={true} id="id" value={sensor.id}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="nameForAdmin">관리자용 센서명</Label>
                                    <Input autoFocus={true} id="nameForAdmin" {...register("nameForAdmin")} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="nameForUser">사용자용 센서명</Label>
                                    <Input autoFocus={false} id="nameForUser" {...register("nameForUser")}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="sensorModelInfo_name">센서모델명</Label>
                                    <Input disabled={true} id="sensorModelInfo_name"
                                           value={sensor.sensorModelInfo?.name}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="sensorModelInfo_description">세선 상세</Label>
                                    <Input disabled={true} id="sensorModelInfo_description"
                                           value={sensor.sensorModelInfo?.description}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="sensorModelInfo_name">측정 타입/단위</Label>

                                    <div className="flex flex-col px-1">
                                        {sensor.sensorModelInfo?.measurementDetails?.map((measurementDetail, index) => {
                                            return (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <div>{measurementDetail.measurementType}</div>
                                                    <Separator orientation="vertical" className="h-5"/>
                                                    <div className="flex items-center space-x-1">
                                                        <div>{measurementDetail.measurementUnit}</div>
                                                        {measurementDetail.measurementUnit === "CELSIUS" &&
                                                            <div className="flex items-center">
                                                                (
                                                                <RiCelsiusLine className="w-4 h-4"/>
                                                                )
                                                            </div>
                                                        }
                                                        {measurementDetail.measurementUnit === "PERCENT" &&
                                                            <div className="flex items-center">
                                                                (
                                                                <RiPercentLine className="w-4 h-4"/>
                                                                )
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="syncStatus">센서 동기화</Label>
                                    <Input disabled={true} id="syncStatus" value={sensor.syncStatus}/>
                                </div>

                                <HouseSectionSensorGraph houseId={houseId!} houseSectionId={houseSectionId!} sensor={sensor}/>
                            </>
                        }

                        {isLoading && <div className="h-fit space-y-10">
                            {Array.from({length: 5}, (_, index) => (
                                <Skeleton key={index} className="h-[38px] w-full"/>
                            ))}
                        </div>
                        }
                    </form>
                </div>
                <div className="flex justify-between px-6 pb-6 sm:p-0">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            toast({
                                variant: "destructive",
                                title: "하우스 동 센서 삭제",
                                description: "정말로 하우스 동 센서를 삭제하시겠습니까?",
                                action: (
                                    <ToastAction
                                        onClick={onDeleteSubmit}
                                        altText="deleteHouseSectionSensor">
                                        확인
                                    </ToastAction>
                                ),
                            })
                        }}>삭제
                    </Button>

                    <Button type="button"
                            onClick={handleSubmit(onUpdateSubmit, () => {
                                toast({
                                    variant: "destructive",
                                    description: "필수 작성 필드를 확인해주세요.",
                                })
                            })}
                    >
                        수정
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionSensorUpdateModal;