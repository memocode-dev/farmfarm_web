// import {useToast} from "@/components/ui/use-toast";
// import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
// import {Button} from "@/components/ui/button";
// import {Label} from "@/components/ui/label";
// import {Skeleton} from "@/components/ui/skeleton";
// import {ToastAction} from "@/components/ui/toast";
// import {Input} from "@/components/ui/input";
//
//
// const OrganizationUpdateCard = ({organizationId}: { organizationId: string }) => {
//
//     const {toast} = useToast()
//     const navigate = useNavigate()
//
//     const {isError, isLoading, data: organization, refetch} =
//         useFindOrganization(organizationId, {
//             query: {
//                 queryKey: ['OrganizationUpdateCard', organizationId],
//             },
//         })
//
//     // const {mutate: updateOrganization} = useUpdateOrganization({
//     //     mutation: {
//     //         onSuccess: () => {
//     //             toast({description: "성공적으로 조직이 수정되었습니다.",})
//     //         },
//     //         onError: (error) => {
//     //             console.log(error);
//     //             toast({
//     //                 variant: "destructive",
//     //                 description: "관리자에게 문의하세요.",
//     //             })
//     //         },
//     //     }
//     // })
//
//     // const {mutate: deleteOrganization} = useDeleteOrganization({
//     //     mutation: {
//     //         onSuccess: () => {
//     //             toast({description: "성공적으로 조직이 삭제되었습니다."})
//     //             navigate(`/admin/organizations`)
//     //         },
//     //         onError: (error) => {
//     //             console.log(error);
//     //             const errorData = error.response?.data as { code: string; message: string }
//     //             if (errorData.code === "ORGANIZATION_MEMBER_EXISTS") {
//     //                 return (
//     //                     toast({
//     //                         variant: "destructive",
//     //                         description: "등록되어 있는 조직멤버가 존재하여 삭제할 수 없습니다.",
//     //                     })
//     //                 )
//     //             }
//     //
//     //             if (errorData.code === "HOUSES_EXISTS") {
//     //                 return (
//     //                     toast({
//     //                         variant: "destructive",
//     //                         description: "등록되어 있는 하우스가 존재하여 삭제할 수 없습니다.",
//     //                     })
//     //                 )
//     //             }
//     //
//     //             toast({
//     //                 variant: "destructive",
//     //                 description: "관리자에게 문의하세요.",
//     //             })
//     //         },
//     //     }
//     // })
//
//     // const {
//     //     register,
//     //     handleSubmit,
//     //     reset,
//     //     formState: {errors},
//     // } = useOrganizationUpdateForm()
//
//     // const onUpdateSubmit = (data: UpdateOrganizationForm) => updateOrganization({
//     //     organizationId: organizationId,
//     //     data: data,
//     // });
//
//     // const onDeleteSubmit = () => deleteOrganization({
//     //     organizationId: organizationId ? organizationId : ""
//     // });
//
//     // useEffect(() => {
//     //     if (organization) {
//     //         reset({
//     //             name: organization.name,
//     //         })
//     //     }
//     // }, [organization]);
//
//     return (
//         <Card className="w-full max-w-2xl">
//             <CardHeader>
//                 <CardTitle>조직 정보</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form>
//                     <div className="grid w-full items-center gap-4">
//                         {isError && <div className="flex space-x-4">
//                             <div>잠시후에 다시 시도해주세요</div>
//                             <Button onClick={() => refetch()}>재시도</Button>
//                         </div>}
//                         {!isLoading && organization &&
//                             <div className="h-[170px] space-y-4">
//                                 <div className="flex flex-col space-y-1.5">
//                                     <Label htmlFor="id">Id</Label>
//                                     <Input disabled={true} id="id" value={organizationId}/>
//                                 </div>
//                                 <div className="flex flex-col space-y-1.5 relative">
//                                     <Label htmlFor="name">Name</Label>
//                                     <Input id="name" {...register("name", {required: "이름을 입력해주세요."})} />
//                                     <div
//                                         className="absolute text-[#ef4444] text-[12px] left-1 top-[60px]">{errors.name && errors.name.message}</div>
//                                 </div>
//                             </div>}
//                         {isLoading &&
//                             <div className="space-y-[32px] h-[150px] mt-5">
//                                 <Skeleton className="h-[38px] w-full"/>
//                                 <Skeleton className="h-[38px] w-full"/>
//                             </div>}
//                     </div>
//                 </form>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//                 <Button
//                     type="button"
//                     variant="destructive"
//                     onClick={() => {
//                         toast({
//                             variant: "destructive",
//                             title: "조직 삭제",
//                             description: "정말로 조직을 삭제하시겠습니까?",
//                             action: (
//                                 <ToastAction
//                                     onClick={onDeleteSubmit}
//                                     altText="organizationDelete">
//                                     확인
//                                 </ToastAction>
//                             ),
//                         })
//                     }}>삭제
//                 </Button>
//
//                 <Button type="button" onClick={handleSubmit(onUpdateSubmit, () => {
//                     toast({
//                         variant: "destructive",
//                         description: "필수 작성 필드를 확인해주세요.",
//                     })
//                 })}>수정</Button>
//             </CardFooter>
//         </Card>
//     )
// }
//
// export default OrganizationUpdateCard;