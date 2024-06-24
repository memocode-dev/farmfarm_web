import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {toast} from "@/components/ui/use-toast";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {useCreateHouseSectionSensor, useFindAllHouseSections} from "@/openapi/api/houses/houses";
import {useFindAllSensorModels} from "@/openapi/api/sensors/sensors";
import {CreateHouseSectionSensorForm} from "@/openapi/model";

const HouseSectionSensorCreateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>();
    const [selectedHouseSectionId, setSelectedHouseSectionId] = useState<string>();

    // 하우스 동 전체 조회(동 id 선택)
    const {data: houseSectionsArrayData, refetch: findAllHouseSectionsRefetch} =
        useFindAllHouseSections(houseId!, {
            query: {
                queryKey: ['HouseSectionSensorCreateModal', houseId],
            },
        });
    const houseSections = houseSectionsArrayData?.houseSections;

    // 센서 모델 전체 조회(센서 모델 id 선택)
    const {
        data: sensorModels
    } = useFindAllSensorModels({
        query: {
            queryKey: ['SensorModels'],
        },
    })

    const {mutate: createHouseSectionSensor} = useCreateHouseSectionSensor({
        mutation: {
            onSuccess: async () => {
                toast({
                    title: "하우스 동 센서 생성",
                    description: "성공적으로 하우스 동의 센서가 생성되었습니다.",
                })
                closeModal({
                    name: ModalTypes.HOUSE_SECTION_SENSOR_CREATE
                });
                await findAllHouseSectionsRefetch();
                reset();
            },
            onError: (error) => {
                console.log(error)
                const errorData = error.response?.data as { code: string; message: string }
                if (errorData.code === "VALIDATION_ERROR") {
                    return (
                        toast({
                            variant: "destructive",
                            title: "포트이름이 없는 동은 센서를 생성할 수 없습니다.",
                            description: "관리자에게 문의하세요.",
                        })
                    )
                }
                if (errorData.code === "NOT_HEALTHY_HOUSE") {
                    return (
                        toast({
                            variant: "destructive",
                            title: "하우스 상태 : NOT_HEALTHY",
                            description: "하우스 수정에 실패하였습니다.",
                        })
                    )
                }

                toast({
                    variant: "destructive",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    })

    const {
        control,
        register,
        handleSubmit,
        reset,
    } = useForm<CreateHouseSectionSensorForm>();

    const onSubmit = (data: CreateHouseSectionSensorForm) => {
        const selectedHouseSection = houseSections?.find(houseSection => houseSection.id === selectedHouseSectionId);

        if (selectedHouseSection) {
            // 선택한 동의 포트이름 조회
            const portNames = selectedHouseSection.sensors?.map(sensor => sensor.portName) || [];
            // 하나의 동의 센서가 여러개면 같은 포트이름도 여러개이므로 중복을 제거하기 위해 첫번째 요소 선택
            const uniquePortName = portNames[0];

            if (uniquePortName) {
                data.portName = uniquePortName;
            }
        }

        createHouseSectionSensor({
            houseId: houseId!,
            houseSectionId: selectedHouseSectionId!,
            data: data
        });
    }

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_CREATE]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_CREATE]?.data);
        }

        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_CREATE]?.isVisible === false) {
            reset();
            setSelectedHouseSectionId("")
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_SENSOR_CREATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_SECTION_SENSOR_CREATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_SECTION_SENSOR_CREATE
                    });
                }
            }}
        >
            <DialogContent className="rounded-lg max-w-[90%] w-[500px]">
                <DialogHeader>
                    <DialogTitle>하우스 동 센서 생성</DialogTitle>
                    <DialogDescription>
                        하우스 동의 센서를 생성할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col py-[10px] space-y-4"
                      onSubmit={handleSubmit(onSubmit, () => {
                          toast({
                              variant: "destructive",
                              description: "필수 항목을 확인해주세요."
                          });
                      })}
                >
                    <div className="space-y-1">
                        <Label htmlFor="nameForAdmin">관라자용 센서명</Label>
                        <Input type="text"
                               id="nameForAdmin"
                               placeholder="관리자용 센서명을 작성해주세요."
                               {...register("nameForAdmin", {required: "관리자용 센서명을 작성해주세요."})}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="nameForUser">사용자용 센서명</Label>
                        <Input type="text"
                               id="nameForUser"
                               placeholder="사용자용 센서명을 작성해주세요."
                               {...register("nameForUser", {required: "사용자용 센서명을 작성해주세요."})}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="houseSectionNumber">하우스 동</Label>
                        <Select
                            value={selectedHouseSectionId}
                            onValueChange={(value) => setSelectedHouseSectionId(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="선택"/>
                            </SelectTrigger>
                            <SelectContent>
                                {houseSections?.map((houseSection, index) => (
                                    <SelectItem key={index} value={houseSection.id!}>
                                        {houseSection.sectionNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sensorModel">센서 모델</Label>
                        <Controller
                            name="sensorModel"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <div
                                    className={`${sensorModels && sensorModels.length > 2 ? `h-[100px]` : ``} p-1 overflow-y-auto grid grid-cols-2 gap-2`}>
                                    {sensorModels && sensorModels.map((sensorModel, index) => (
                                        <div key={index} className="flex items-center space-x-1">
                                            <Checkbox
                                                id={sensorModel.name}
                                                checked={field.value?.includes(sensorModel.name!) || false}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? sensorModel.name : "");
                                                }}
                                            />
                                            <label htmlFor={sensorModel.name}>
                                                {sensorModel.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                    <Button>생성</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionSensorCreateModal