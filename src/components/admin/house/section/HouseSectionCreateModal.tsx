import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {useCreateHouseSection, useFindAllHouseSections} from "@/openapi/api/houses/houses";
import {CreateHouseSectionForm} from "@/openapi/model";

const HouseSectionCreateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>()
    const [setCreatedHouseSectionId, setSetCreatedHouseSectionId] = useState<(houseSectionId: string) => void>()

    const {refetch} =
        useFindAllHouseSections(houseId!, {
            query: {
                queryKey: ['HouseSections', houseId],
            },
        });

    const {
        mutate: createHouseSection,
    } = useCreateHouseSection({
        mutation: {
            onSuccess: async (data) => {
                toast({
                    title: "하우스 동 생성",
                    description: "성공적으로 하우스 동이 생성되었습니다.",
                })
                closeModal({
                    name: ModalTypes.HOUSE_SECTION_CREATE
                });
                await refetch();
                if (setCreatedHouseSectionId) {
                    setCreatedHouseSectionId(data);
                }
            },
            onError: (error) => {
                console.log(error)
                toast({
                    variant: "destructive",
                    description: "관리자에게 문의하세요."
                });
            },
        }
    });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<CreateHouseSectionForm>();

    const onSubmit = (data: CreateHouseSectionForm) => createHouseSection({
        houseId: houseId!,
        data: data
    });

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_CREATE]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_CREATE]?.data.houseId)
            setSetCreatedHouseSectionId(() => modalState[ModalTypes.HOUSE_SECTION_CREATE]?.data.setCreatedHouseSectionId);
        }

        if (modalState[ModalTypes.HOUSE_SECTION_CREATE]?.isVisible === false) {
            reset()
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_CREATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_SECTION_CREATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_SECTION_CREATE
                    });
                }
            }}
        >
            <DialogContent className="rounded-lg max-w-[90%] w-[400px]">
                <DialogHeader>
                    <DialogTitle>하우스 동 생성</DialogTitle>
                    <DialogDescription>
                        하우스 동을 생성할 수 있습니다.
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
                        <Label htmlFor="sectionNumber" className="w-[70px]">동 번호</Label>
                        <Input type="text"
                               id="sectionNumber"
                               placeholder="하우스 동 번호를 작성해주세요."
                               {...register("sectionNumber", {required: "하우스 동 번호를 작성해주세요."})}
                        />
                    </div>

                    <Button>생성</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionCreateModal;