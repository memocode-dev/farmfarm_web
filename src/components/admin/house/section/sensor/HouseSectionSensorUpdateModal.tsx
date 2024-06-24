import {Dialog, DialogContent} from "@/components/ui/dialog";
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
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {ToastAction} from "@/components/ui/toast";
import {Separator} from "@/components/ui/separator";
import {RiCelsiusLine, RiPercentLine} from "react-icons/ri";

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
            onSuccess: async (data) => {
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
            <DialogContent className="rounded-lg max-w-[90%] max-h-[90vh] w-[450px] h-[700px] overflow-y-auto">
                <Card className="w-full lg:max-w-2xl">
                    <CardHeader>
                        <CardTitle>하우스 동 센서 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4 px-1 overflow-y-auto">
                                {!isLoading && sensor &&
                                    <div className="h-fit space-y-7">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="id">Id</Label>
                                            <Input disabled={true} id="id" value={sensor.id}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="nameForAdmin">관리자용 센서명</Label>
                                            <Input id="nameForAdmin" {...register("nameForAdmin")} />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="nameForUser">사용자용 센서명</Label>
                                            <Input id="nameForUser" {...register("nameForUser")}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="sensorModelInfo_name">센서모델명</Label>
                                            <Input disabled={true} id="sensorModelInfo_name"
                                                   value={sensor.sensorModelInfo?.name}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="sensorModelInfo_description">세선 상세</Label>
                                            <Input disabled={true} id="sensorModelInfo_description"
                                                   value={sensor.sensorModelInfo?.description}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="sensorModelInfo_name">측정 타입/단위</Label>

                                            {sensor.sensorModelInfo?.measurementDetails?.map((measurementDetail, index) => {
                                                return (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <div>{measurementDetail.measurementType}</div>
                                                        <Separator orientation="vertical" className="h-5"/>
                                                        <div className="flex items-center space-x-1">
                                                            <div>{measurementDetail.measurementUnit}</div>
                                                            {measurementDetail.measurementUnit === "CELSIUS" &&
                                                                <RiCelsiusLine className="w-4 h-4"/>}
                                                            {measurementDetail.measurementUnit === "PERCENT" &&
                                                                <RiPercentLine className="w-4 h-4"/>}
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                        </div>

                                        <div className="flex flex-col space-y-1.5 ">
                                            <Label htmlFor="syncStatus">센서 동기화</Label>
                                            <Input disabled={true} id="syncStatus" value={sensor.syncStatus}/>
                                        </div>
                                    </div>
                                }

                                {isLoading && <div className="h-fit space-y-10">
                                    {Array.from({length: 5}, (_, index) => (
                                        <Skeleton key={index} className="h-[38px] w-full"/>
                                    ))}
                                </div>
                                }
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
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
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionSensorUpdateModal;