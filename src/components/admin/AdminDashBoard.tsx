'use client'

import {Button} from "@/components/ui/button";
import {MdOutlineDashboard} from "react-icons/md";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../ui/hover-card";
import {FaQuestion} from "react-icons/fa";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext, useState} from "react";
import AdminDashBoardCreate from "@/components/admin/AdminDashBoardCreate";

const AdminDashBoard = () => {

    const {openModal} = useContext(ModalContext)
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    return (
        <>
            <div className="flex flex-col flex-1 justify-center bg-background p-5">
                <div className="flex space-x-2 relative">
                    <Button
                        onClick={() => {
                            openModal({
                                name: ModalTypes.DASHBOARD_CREATE,
                            })
                        }}
                        className="font-semibold">보드 추가하기</Button>

                    <HoverCard openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                            <Button variant="link" className="relative p-0">
                                <MdOutlineDashboard className="w-7 h-7"/>
                                <div
                                    className="absolute bottom-[6.5px] -right-[1px] text-primary w-fit h-fit bg-background pt-[1.5px]">
                                    <FaQuestion className="w-2.5 h-2.5"/>
                                </div>
                            </Button>
                        </HoverCardTrigger>

                        <HoverCardContent
                            side={"bottom"}
                            className="flex flex-col text-center border w-fit h-fit text-gray-600 p-5">
                            <div>
                                <span className="font-extrabold text-gray-900 mr-1">보드 추가하기</span>
                                <span className="mb-10">버튼을 눌러</span>
                            </div>
                            <div>원하는 보드를 추가해보세요!</div>
                            <div>하우스 정보를 한눈에 볼 수 있습니다.</div>
                        </HoverCardContent>
                    </HoverCard>
                </div>

                {/*{selectedItems.length !== 0 &&*/}
                {/*    <div className="py-3">*/}
                {/*        <div className="flex-1 h-fit p-5 border rounded-md"></div>*/}
                {/*    </div>*/}
                {/*}*/}
            </div>

            <AdminDashBoardCreate selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
        </>
    )
}

export default AdminDashBoard;
