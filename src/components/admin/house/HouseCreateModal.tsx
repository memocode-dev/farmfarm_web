import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {SubmitHandler, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {toast} from "@/components/ui/use-toast";
import {CreateHouseForm} from "@/openapi/model";
import {useCreateHouse} from "@/openapi/api/houses/houses";
import {Input} from "@/components/ui/input";

const HouseCreateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<CreateHouseForm>()

    const onSubmit: SubmitHandler<CreateHouseForm> = (data) => createHouse({data: data})

    const {mutate: createHouse} = useCreateHouse({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "하우스 생성",
                    description: "성공적으로 하우스가 생성되었습니다.",
                })
                closeModal({
                    name: ModalTypes.HOUSE_CREATE
                });
            },
            onError: (error) => {
                console.log(error);
                toast({
                    title: "하우스 생성 실패",
                    description: "에러 내용 표시",
                    variant: "destructive",
                })
            },
        }
    })

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_CREATE]?.isVisible === false) {
            reset()
        }
    }, [modalState[ModalTypes.HOUSE_CREATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_CREATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_CREATE
                    });
                }
            }}
        >
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>하우스 생성</DialogTitle>
                    <DialogDescription>
                        하우스를 생성할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-auto w-full max-w-sm space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">하우스명</Label>
                        <Input {...register("name", {required: true})}
                               type="text" placeholder="하우스명을 입력해주세요"/>
                    </div>
                    <Button type="submit">생성</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}


export default HouseCreateModal;