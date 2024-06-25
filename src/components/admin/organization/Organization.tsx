'use client'

import {useParams, useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {
    useDeleteOrganization,
    useFindOrganization,
    useUpdateOrganization
} from "@/openapi/api/organizations/organizations";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import formatDate from "@/utils/formatDate";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {useForm} from "react-hook-form";
import {UpdateOrganizationForm} from "@/openapi/model";
import {useEffect} from "react";

const Organization = () => {

    const params = useParams();
    const organizationId = params.id as string;
    const router = useRouter();

    const {isError, isLoading, data: organization, refetch: findOrganizationRefetch} =
        useFindOrganization(organizationId, {
            query: {
                queryKey: ['Organization', organizationId],
            },
        });

    const {mutate: deleteOrganization} = useDeleteOrganization({
        mutation: {
            onSuccess: () => {
                toast({description: "성공적으로 조직이 삭제되었습니다."})
                router.push("/admin/organizations")
            },
            onError: (error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "조직 삭제에 실패하였습니다.",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    })

    const {mutate: updateOrganization} = useUpdateOrganization({
        mutation: {
            onSuccess: async () => {
                toast({description: "성공적으로 조직이 수정되었습니다."})
                await findOrganizationRefetch();
            },
            onError: (error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "조직 수정에 실패하였습니다.",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    })

    const onDeleteSubmit = () => deleteOrganization({organizationId: organizationId});

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<UpdateOrganizationForm>();

    const onUpdateSubmit = (data: UpdateOrganizationForm) => updateOrganization({
        organizationId: organizationId,
        data: data,
    });

    useEffect(() => {
        if (organization) {
            reset({
                name: organization.name
            })
        }
    }, [organization]);

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findOrganizationRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <div className="flex-1 p-5 space-y-5">
            <div className="flex justify-start">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>조직 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                {!isLoading && organization &&
                                    <div className="h-fit space-y-7">
                                        <div className="flex flex-col space-y-1.5 relative">
                                            <Label htmlFor="id">Id</Label>
                                            <Input disabled={true} id="id" value={organization.id}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">조직명</Label>
                                            <Input id="name" {...register("name")} />
                                        </div>
                                        <div className="flex flex-col space-y-1.5 relative">
                                            <Label htmlFor="createdAt">생성일</Label>
                                            <Input disabled={true} id="createdAt"
                                                   value={formatDate(organization.createdAt || "")}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5 relative">
                                            <Label htmlFor="updatedAt">수정일</Label>
                                            <Input disabled={true} id="updatedAt"
                                                   value={formatDate(organization.updatedAt || "")}/>
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
                                    title: "조직 삭제",
                                    description: "정말로 조직을 삭제하시겠습니까?",
                                    action: (
                                        <ToastAction
                                            onClick={onDeleteSubmit}
                                            altText="HouseDelete">
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
                                })}>
                            수정
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Organization;