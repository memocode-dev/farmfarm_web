import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast"
import {useForm} from "react-hook-form";
import {useCreateOrganization, useFindAllOrganizations} from "@/openapi/api/organizations/organizations";
import {CreateOrganizationForm} from "@/openapi/model";


const OrganizationCreateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);

    const {refetch} = useFindAllOrganizations({
        query: {
            queryKey: ['Organizations'],
        },
    });

    const {mutate: createOrganization} = useCreateOrganization({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "조직 생성",
                    description: "성공적으로 조직이 생성되었습니다.",
                })
                closeModal({
                    name: ModalTypes.ORGANIZATION_CREATE
                });
                refetch();
            },
            onError: (error) => {
                console.log(error);
                toast({
                    title: "조직 생성 실패",
                    description: "에러 내용 표시",
                    variant: "destructive",
                })
            }
        }
    })

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<CreateOrganizationForm>()

    const onSubmit = (data: CreateOrganizationForm) => createOrganization({data: data})

    useEffect(() => {
        if (modalState[ModalTypes.ORGANIZATION_CREATE]?.isVisible === false) {
            reset()
        }
    }, [modalState[ModalTypes.ORGANIZATION_CREATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.ORGANIZATION_CREATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.ORGANIZATION_CREATE
                    });
                }
            }}
        >
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>조직 생성</DialogTitle>
                    <DialogDescription>
                        조직을 생성할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-auto w-full max-w-sm space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">조직명</Label>
                        <Input {...register("name", {required: true})}
                               type="text" placeholder="조직명을 입력해주세요"/>
                    </div>
                    <Button type="submit">생성</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default OrganizationCreateModal;