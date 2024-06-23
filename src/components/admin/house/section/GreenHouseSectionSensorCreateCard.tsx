// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
// import {ModalContext, ModalTypes} from "@/context/ModalConext";
// import {toast} from "@/components/ui/use-toast";
// import {Label} from "@/components/ui/label";
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
// import {useContext, useEffect, useState} from "react";
// import {useCreateGreenhouseSectionSensor, useFindAllGreenhouseSection} from "@/openapi/api/greenhouses/greenhouses";
// import {Controller, useForm} from "react-hook-form";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
// import {
//     GreenhouseSectionSensorCreateForm,
// } from "@/openapi/model";
// import {useFindAllSensorModel} from "@/openapi/api/sensors/sensors";
// import {Checkbox} from "@/components/ui/checkbox";
//
// const GreenHouseSectionSensorCreateCard = () => {
//
//     const {modalState, closeModal} = useContext(ModalContext);
//     const [greenHouseId, setGreenHouseId] = useState<string>();
//     const [selectedGreenHouseSectionId, setSelectedGreenHouseSectionId] = useState<string>();
//
//     // 하우스 동 전체 조회(동 id 선택)
//     const {data: green_house_sections, refetch} =
//         useFindAllGreenhouseSection(greenHouseId as string, {
//             query: {
//                 queryKey: ['GreenHouseSections'],
//             },
//         });
//
//     // 센서 모델 전체 조회(센서 모델 id 선택)
//     const {
//         data: sensor_models
//     } = useFindAllSensorModel({
//         query: {
//             queryKey: ['SensorModels'],
//         },
//     })
//
//     const {mutate: createGreenhouseSectionSensor} = useCreateGreenhouseSectionSensor({
//         mutation: {
//             onSuccess: () => {
//                 toast({
//                     title: "하우스 동 센서 생성",
//                     description: "성공적으로 하우스 동의 센서가 생성되었습니다.",
//                 })
//                 closeModal({
//                     name: ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE
//                 });
//                 refetch();
//                 reset();
//             },
//             onError: (error) => {
//                 console.log(error);
//                 toast({
//                     title: "하우스 동 센서 생성 실패",
//                     description: "에러 내용 표시",
//                     variant: "destructive",
//                 })
//             },
//         }
//     })
//
//     const {
//         control,
//         register,
//         handleSubmit,
//         reset,
//     } = useForm<GreenhouseSectionSensorCreateForm>();
//
//     const onSubmit = (data: GreenhouseSectionSensorCreateForm) => createGreenhouseSectionSensor({
//         greenhouseId: greenHouseId!,
//         greenhouseSectionId: selectedGreenHouseSectionId!,
//         data: data
//     });
//
//     useEffect(() => {
//         if (modalState[ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE]?.isVisible === true) {
//             setGreenHouseId(modalState[ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE]?.data as string)
//         }
//     }, [modalState[ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE]]);
//
//     return (
//         <Dialog
//             modal={true}
//             open={modalState[ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE]?.isVisible}
//             onOpenChange={(open) => {
//                 if (!open) {
//                     closeModal({
//                         name: ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE
//                     });
//                 }
//             }}
//         >
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>하우스 동 센서 생성</DialogTitle>
//                     <DialogDescription>
//                         하우스 동의 센서를 생성할 수 있습니다.
//                     </DialogDescription>
//                 </DialogHeader>
//
//                 <form className="flex flex-col py-5 space-y-4"
//                       onSubmit={handleSubmit(onSubmit, () => {
//                           toast({
//                               variant: "destructive",
//                               description: "필수 항목을 확인해주세요."
//                           });
//                       })}
//                 >
//                     <div className="flex items-center space-x-2">
//                         <Label htmlFor="adminName" className="w-[50px]">센서명</Label>
//                         <Input type="text"
//                                id="adminName"
//                                placeholder="센서명을 작성해주세요."
//                                {...register("adminName", {required: "센서명을 작성해주세요."})}
//                         />
//                     </div>
//
//                     <div className="space-y-1">
//                         <Label htmlFor="greenhouseSectionId">하우스 동</Label>
//                         <Select
//                             value={selectedGreenHouseSectionId}
//                             onValueChange={(value) => setSelectedGreenHouseSectionId(value)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="선택"/>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {green_house_sections?.map((green_house_section, index) => (
//                                     <SelectItem key={index} value={green_house_section.id}>
//                                         {green_house_section.sectionNumber}
//                                     </SelectItem>
//                                 )) || null}
//                             </SelectContent>
//                         </Select>
//                     </div>
//
//                     <div className="space-y-2">
//                         <Label htmlFor="sensorModelId">센서 모델</Label>
//                         <Controller
//                             name="sensorModelId"
//                             control={control}
//                             rules={{required: true}}
//                             render={({field}) => (
//                                 <div className="p-1 h-[100px] overflow-y-auto grid grid-cols-2 gap-2">
//                                     {sensor_models?.map((sensor_model, index) => (
//                                         <div key={index} className="flex items-center space-x-1">
//                                             <Checkbox
//                                                 id={sensor_model.id}
//                                                 checked={field.value?.includes(sensor_model.id) || false}
//                                                 onCheckedChange={(checked) => {
//                                                     field.onChange(checked ? sensor_model.id : "");
//                                                 }}
//                                             />
//                                             <label htmlFor={sensor_model.id}>
//                                                 {sensor_model.modelName}
//                                             </label>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         />
//                     </div>
//                     <Button>생성</Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
//
// export default GreenHouseSectionSensorCreateCard