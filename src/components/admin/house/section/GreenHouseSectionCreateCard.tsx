// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
// import {ModalContext, ModalTypes} from "@/context/ModalConext";
// import {Label} from "@/components/ui/label";
// import {useForm} from "react-hook-form";
// import {Button} from "@/components/ui/button";
// import {useContext, useEffect, useState} from "react";
// import {toast} from "@/components/ui/use-toast";
// import {Input} from "@/components/ui/input";
// import {GreenhouseSectionCreateForm} from "@/openapi/model";
// import {useCreateGreenhouseSection, useFindAllGreenhouseSection} from "@/openapi/api/greenhouses/greenhouses";
//
// interface GreenHouseSectionCreateCardProps {
//     setCreatedGreenHouseSectionId: (id: string) => void;
// }
//
// const GreenHouseSectionCreateCard = ({setCreatedGreenHouseSectionId}: GreenHouseSectionCreateCardProps) => {
//
//     const {modalState, closeModal} = useContext(ModalContext);
//     const [greenHouseId, setGreenHouseId] = useState<string>()
//
//     const {
//         mutate: createGreenHouseSection,
//     } = useCreateGreenhouseSection({
//         mutation: {
//             onSuccess: (data) => {
//                 toast({
//                     title: "하우스 동 생성",
//                     description: "성공적으로 하우스 동이 생성되었습니다.",
//                 })
//                 closeModal({
//                     name: ModalTypes.GREENHOUSE_SECTION_CREATE
//                 });
//                 refetch();
//                 setCreatedGreenHouseSectionId(data);
//             },
//             onError: (error) => {
//                 console.log(error)
//                 toast({
//                     variant: "destructive",
//                     description: "관리자에게 문의하세요."
//                 });
//             },
//         }
//     });
//
//     const {refetch} =
//         useFindAllGreenhouseSection(greenHouseId as string, {
//             query: {
//                 queryKey: ['GreenHouseSections'],
//             },
//         });
//
//     const {
//         register,
//         handleSubmit,
//         reset,
//     } = useForm<GreenhouseSectionCreateForm>();
//
//     const onSubmit = (data: GreenhouseSectionCreateForm) => createGreenHouseSection({
//         greenhouseId: greenHouseId as string,
//         data: data
//     });
//
//     useEffect(() => {
//         if (modalState[ModalTypes.GREENHOUSE_SECTION_CREATE]?.isVisible === true) {
//             setGreenHouseId(modalState[ModalTypes.GREENHOUSE_SECTION_CREATE]?.data as string)
//         }
//
//         if (modalState[ModalTypes.GREENHOUSE_SECTION_CREATE]?.isVisible === false) {
//             reset()
//         }
//     }, [modalState[ModalTypes.GREENHOUSE_SECTION_CREATE]]);
//
//     return (
//         <Dialog
//             modal={true}
//             open={modalState[ModalTypes.GREENHOUSE_SECTION_CREATE]?.isVisible}
//             onOpenChange={(open) => {
//                 if (!open) {
//                     closeModal({
//                         name: ModalTypes.GREENHOUSE_SECTION_CREATE
//                     });
//                 }
//             }}
//         >
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>하우스 동 생성</DialogTitle>
//                     <DialogDescription>
//                         하우스 동을 생성할 수 있습니다.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form className="flex space-x-2 py-[20px] items-center mx-auto max-w-md"
//                       onSubmit={handleSubmit(onSubmit, () => {
//                           toast({
//                               variant: "destructive",
//                               description: "필수 항목을 확인해주세요."
//                           });
//                       })}>
//                     <Label htmlFor="sectionNumber" className="w-[70px]">동 번호</Label>
//                     <Input type="text"
//                            id="sectionNumber"
//                            placeholder="하우스 동 번호를 작성해주세요."
//                            {...register("sectionNumber", {required: "하우스 동 번호를 작성해주세요."})}
//                     />
//                     <Button>생성</Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
//
// export default GreenHouseSectionCreateCard;