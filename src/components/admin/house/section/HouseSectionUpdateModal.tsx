import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {useFindAllHouseSections, useUpdateHouseSection} from "@/openapi/api/houses/houses";
import {UpdateHouseSectionForm} from "@/openapi/model";

const HouseSectionUpdateModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>()
    const [houseSectionId, setHouseSectionId] = useState<string>()

    const {refetch} =
        useFindAllHouseSections(houseId!, {
            query: {
                queryKey: ['HouseSections', houseId],
            },
        });

    const {
        mutate: updateHouseSection,
    } = useUpdateHouseSection({
        mutation: {
            onSuccess: async (data) => {
                toast({
                    title: "하우스 동 수정",
                    description: "성공적으로 하우스 동이 수정되었습니다.",
                })
                closeModal({
                    name: ModalTypes.HOUSE_SECTION_UPDATE
                });
                await refetch();
            },
            onError: (error) => {
                console.log(error)
                const errorStatus = error.response?.status
                if (errorStatus === 500) {
                    return (
                        toast({
                            variant: "destructive",
                            description: "하우스 동 번호는 숫자만 입력가능합니다.",
                        })
                    )
                }

                toast({
                    variant: "destructive",
                    title: "하우스 동 수정에 실패하였습니다.",
                    description: "관리자에게 문의하세요.",
                })
            },
        }
    });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<UpdateHouseSectionForm>();

    const onSubmit = (data: UpdateHouseSectionForm) => {
        updateHouseSection({
            houseId: houseId!,
            houseSectionId: houseSectionId!,
            data: data
        });
    }

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.data.houseId)
            setHouseSectionId(modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.data.houseSectionId)

            reset({
                sectionNumber: modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.data.sectionNumber,
            })
        }

        if (modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.isVisible === false) {
            reset()
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_UPDATE]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_SECTION_UPDATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_SECTION_UPDATE
                    });
                }
            }}
        >
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="rounded-lg max-w-[90%] w-[300px]">
                <DialogHeader>
                    <DialogTitle>하우스 동 수정</DialogTitle>
                    <DialogDescription>
                        하우스 동을 수정할 수 있습니다.
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
                               {...register("sectionNumber", {required: "하우스 동 번호를 작성해주세요."})}
                        />
                    </div>

                    <Button>수정</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionUpdateModal;