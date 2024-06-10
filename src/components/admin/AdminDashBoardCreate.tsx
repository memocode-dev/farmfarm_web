import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

interface DashBoardCreateModalProps {
    selectedItems: number[];
    setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const AdminDashBoardCreate = ({selectedItems, setSelectedItems}: DashBoardCreateModalProps) => {

    const {modalState, closeModal} = useContext(ModalContext)

    interface Item {
        id: number;
        label: string;
        description: string;
    }

    const items: Item[] = [
        {id: 1, label: '유저', description: "하우스 관리자를 확인할 수 있습니다."},
        {id: 2, label: '조직', description: "하우스 내 조직을 확인할 수 있습니다."},
        {id: 3, label: '하우스', description: "관리중인 하우스를 확인할 수 있습니다."},
        {id: 4, label: '센서', description: "하우스의 등록된 센서를 확인할 수 있습니다."},
        {id: 5, label: '센서타입', description: "사용중인 센서의 타입을 확인할 수 있습니다."}
    ];

    const handleCheckboxChange = (itemId: number) => {
        setSelectedItems((prevSelected: number[]) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const handleConfirm = () => {
        closeModal({
            name: ModalTypes.DASHBOARD_CREATE
        });
    };

    return (
        <Dialog
            modal={false}
            open={modalState[ModalTypes.DASHBOARD_CREATE]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.DASHBOARD_CREATE
                    });
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>보드 추가</DialogTitle>
                    <DialogDescription>
                        추가를 원하는 보드를 선택하세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-3">
                    <div className="space-y-8">
                        <div className="space-y-2 justify-center">
                            {items.map((item) => (
                                <Label
                                    key={item.id}
                                    htmlFor={`checkbox-${item.id}`}
                                    className="flex border rounded-md p-4 space-x-3 cursor-pointer"
                                >
                                    <Checkbox
                                        id={`checkbox-${item.id}`}
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => handleCheckboxChange(item.id)}
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium leading-none">
                                            {item.label}
                                        </div>
                                        <DialogDescription>{item.description}</DialogDescription>
                                    </div>
                                </Label>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button size="lg" type="button" onClick={handleConfirm}>확인</Button>

                            <Button
                                onClick={() => {
                                    closeModal({
                                        name: ModalTypes.DASHBOARD_CREATE
                                    });
                                }}
                                variant="secondary"
                                className="h-11 px-6"
                                type="button">
                                취소
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AdminDashBoardCreate;