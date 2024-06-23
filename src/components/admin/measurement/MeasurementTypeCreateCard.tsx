// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
// import {useContext, useEffect} from "react";
// import {ModalContext, ModalTypes} from "@/context/ModalConext";
// import {Input} from "@/components/ui/input";
// import {Label} from "@/components/ui/label";
// import {Button} from "@/components/ui/button";
// import {toast} from "@/components/ui/use-toast"
// import {Controller, useForm} from "react-hook-form";
// import {MeasurementTypeCreateForm, MeasurementTypeCreateFormUnit} from "@/openapi/model";
// import {useCreateMeasurementType, useFindAllMeasurementType} from "@/openapi/api/measurement/measurement";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
//
// const MeasurementTypeCreateCard = () => {
//
//     const {modalState, closeModal} = useContext(ModalContext);
//
//     const {refetch} = useFindAllMeasurementType({
//         query: {
//             queryKey: ['MeasurementTypes'],
//         },
//     });
//
//     const {mutate: createMeasurementType} = useCreateMeasurementType({
//         mutation: {
//             onSuccess: () => {
//                 toast({
//                     title: "측정 타입 생성",
//                     description: "성공적으로 측정타입이 생성되었습니다.",
//                 })
//                 closeModal({
//                     name: ModalTypes.MEASUREMENT_TYPE_CREATE
//                 });
//                 refetch()
//             },
//             onError: (error) => {
//                 console.log(error);
//                 toast({
//                     title: "측정 타입 생성 실패",
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
//     } = useForm<MeasurementTypeCreateForm>();
//
//     const onSubmit = (data: MeasurementTypeCreateForm) => createMeasurementType({data: data});
//
//     useEffect(() => {
//         if (modalState[ModalTypes.MEASUREMENT_TYPE_CREATE]?.isVisible === false) {
//             reset()
//         }
//     }, [modalState[ModalTypes.MEASUREMENT_TYPE_CREATE]]);
//
//     return (
//         <Dialog
//             modal={true}
//             open={modalState[ModalTypes.MEASUREMENT_TYPE_CREATE]?.isVisible}
//             onOpenChange={(open) => {
//                 if (!open) {
//                     closeModal({
//                         name: ModalTypes.MEASUREMENT_TYPE_CREATE
//                     });
//                 }
//             }}
//         >
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>측정 타입 생성</DialogTitle>
//                     <DialogDescription>
//                         측정 타입을 생성할 수 있습니다.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form className="flex flex-col mx-auto w-full max-w-sm space-y-4"
//                       onSubmit={handleSubmit(onSubmit, () => {
//                           toast({
//                               variant: "destructive",
//                               description: "필수 항목을 확인해주세요."
//                           });
//                       })}>
//                     <div className="flex items-center space-x-2">
//                         <Label htmlFor="name" className="w-[70px]">타입명</Label>
//                         <Input type="text"
//                                id="type"
//                                placeholder="타입명을 작성해주세요."
//                                {...register("type", {required: "타입명을 작성해주세요."})}
//                         />
//                     </div>
//
//                     <div className="space-y-1">
//                         <Label htmlFor="unit">단위</Label>
//                         <Controller
//                             name="unit"
//                             control={control}
//                             rules={{required: true}}
//                             render={({field}) => {
//                                 return (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={(value) => field.onChange(value)}
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="선택"/>
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {Object.entries(MeasurementTypeCreateFormUnit).map(([key, value]) => {
//                                                 return (
//                                                     <SelectItem key={key}
//                                                                 value={value}>{value}</SelectItem>
//                                                 );
//                                             }) || null}
//                                         </SelectContent>
//                                     </Select>
//                                 )
//                             }}
//                         />
//                     </div>
//                     <Button>생성</Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
//
// export default MeasurementTypeCreateCard;