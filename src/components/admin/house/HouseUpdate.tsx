import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import formatDate from "@/utils/formatDate";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {useDeleteHouse, useUpdateHouse} from "@/openapi/api/houses/houses";
import {useForm} from "react-hook-form";
import {FindHouseResponse, UpdateHouseForm} from "@/openapi/model";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

interface HouseUpdateCardProps {
    houseId: string;
    house: FindHouseResponse;
    isLoading: boolean;
    findHouseRefetch: () => void;
}

const HouseUpdate = ({houseId, house, isLoading, findHouseRefetch}: HouseUpdateCardProps) => {

    const router = useRouter();

    const {mutate: deleteHouse} = useDeleteHouse({
        mutation: {
            onSuccess: () => {
                toast({description: "성공적으로 하우스가 삭제되었습니다."})
                router.push("/admin/houses")
            },
            onError: (error) => {
                console.log(error);
                const errorData = error.response?.data as { code: string; message: string }
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

    const {mutate: updateHouse} = useUpdateHouse({
        mutation: {
            onSuccess: async () => {
                toast({description: "성공적으로 하우스가 수정되었습니다."})
                await findHouseRefetch();
            },
            onError: (error) => {
                console.log(error);
                const errorData = error.response?.data as { code: string; message: string }
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

    const onDeleteSubmit = () => deleteHouse({houseId: houseId});

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<UpdateHouseForm>();

    const onUpdateSubmit = (data: UpdateHouseForm) => updateHouse({
        houseId: houseId,
        data: data,
    });

    useEffect(() => {
        if (house) {
            reset({
                name: house.name
            })
        }
    }, [house]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>하우스 정보</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        {!isLoading && house &&
                            <div className="h-fit space-y-7">
                                <div className="flex flex-col space-y-1.5 relative">
                                    <Label htmlFor="id">Id</Label>
                                    <Input disabled={true} id="id" value={house.id}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">하우스명</Label>
                                    <Input id="name" {...register("name")} />
                                </div>
                                <div className="flex flex-col space-y-1.5 relative">
                                    <Label htmlFor="createdAt">생성일</Label>
                                    <Input disabled={true} id="createdAt"
                                           value={formatDate(house.createdAt || "")}/>
                                </div>
                                <div className="flex flex-col space-y-1.5 relative">
                                    <Label htmlFor="updatedAt">수정일</Label>
                                    <Input disabled={true} id="updatedAt"
                                           value={formatDate(house.updatedAt || "")}/>
                                </div>
                                <div className="flex flex-col space-y-1.5 relative">
                                    <Label htmlFor="syncStatus">하우스 동기화</Label>
                                    <Input disabled={true} id="syncStatus"
                                           value={house.syncStatus}/>
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
                            title: "하우스 삭제",
                            description: "정말로 하우스를 삭제하시겠습니까?",
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
    )
}

export default HouseUpdate;