// import {useContext, useEffect} from "react";
// import {ModalContext, ModalTypes} from "@/context/ModalConext";
// import {Controller, SubmitHandler, useForm} from "react-hook-form";
// import {Button} from "@/components/ui/button";
// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
// import {Label} from "@/components/ui/label";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
// import {toast} from "@/components/ui/use-toast";
// import {GreenhouseCreateForm} from "@/openapi/model";
// import {useFindAllOrganization} from "@/openapi/api/organizations/organizations";
// import {useCreateGreenhouse} from "@/openapi/api/greenhouses/greenhouses";
//
// const GreenHouseCreateCard = () => {
//
//     const {modalState, closeModal} = useContext(ModalContext);
//
//     const {
//         control,
//         handleSubmit,
//         reset,
//     } = useForm<GreenhouseCreateForm>()
//
//     const onSubmit: SubmitHandler<GreenhouseCreateForm> = (data) => createGreenHouse({data: data})
//
//     const {mutate: createGreenHouse} = useCreateGreenhouse({
//         mutation: {
//             onSuccess: () => {
//                 toast({
//                     title: "하우스 생성",
//                     description: "성공적으로 하우스가 생성되었습니다.",
//                 })
//                 closeModal({
//                     name: ModalTypes.GREENHOUSE_CREATE
//                 });
//             },
//             onError: (error) => {
//                 console.log(error);
//                 toast({
//                     title: "하우스 생성 실패",
//                     description: "에러 내용 표시",
//                     variant: "destructive",
//                 })
//             },
//         }
//     })
//
//     const {isError, isLoading, data: organizations, refetch} = useFindAllOrganization({
//         query: {
//             queryKey: ['GreenHouseCreateCard'],
//         },
//     });
//
//     useEffect(() => {
//         if (modalState[ModalTypes.GREENHOUSE_CREATE]?.isVisible === false) {
//             reset()
//         }
//     }, [modalState[ModalTypes.GREENHOUSE_CREATE]]);
//
//     if (isError) {
//         return (
//             <div className="flex space-x-4">
//                 <div>잠시후에 다시 시도해주세요</div>
//                 <Button onClick={() => refetch()}>재시도</Button>
//             </div>
//         )
//     }
//
//     return (
//         <Dialog
//             modal={true}
//             open={modalState[ModalTypes.GREENHOUSE_CREATE]?.isVisible}
//             onOpenChange={(open) => {
//                 if (!open) {
//                     closeModal({
//                         name: ModalTypes.GREENHOUSE_CREATE
//                     });
//                 }
//             }}
//         >
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>하우스 생성</DialogTitle>
//                     <DialogDescription>
//                         하우스를 생성할 수 있습니다.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-auto w-full max-w-sm space-y-4">
//                     {!isLoading &&
//                         <div className="space-y-1">
//                             <Label htmlFor="organizations">조직</Label>
//                             <Controller
//                                 name="organizationId"
//                                 control={control}
//                                 rules={{required: true}}
//                                 render={({field}) => {
//                                     return (
//                                         <Select
//                                             value={field.value}
//                                             onValueChange={(value) => field.onChange(value)}
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="선택"/>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {organizations?.map(organization => {
//                                                     return (
//                                                         <SelectItem key={organization.id}
//                                                                     value={organization.id!}>{organization.name}</SelectItem>
//                                                     );
//                                                 }) || null}
//                                             </SelectContent>
//                                         </Select>
//                                     )
//                                 }}
//                             />
//                         </div>
//                     }
//                     <Button type="submit">생성</Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
//
// export default GreenHouseCreateCard;