'use client'

import {useRouter} from "next/navigation";
import {IoMdRefresh, IoMdReturnLeft, IoMdReturnRight} from "react-icons/io";
import {Button} from "@/components/ui/button";

const BottomBar = () => {

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const goForward = () => {
        window.history.forward();
    };

    return (
        <div
            className="flex flex-1 md:hidden fixed bottom-0 left-0 right-0 p-1 border-t bg-white bg-opacity-50 backdrop-blur z-[10] h-14">
            <div className="flex flex-1 justify-around items-center">
                <Button variant="ghost" className="w-fit h-fit px-2" onClick={goBack}>
                    <IoMdReturnLeft className="w-7 h-7"/>
                </Button>
                <Button variant="ghost" className="w-fit h-fit px-2" onClick={handleRefresh}>
                    <IoMdRefresh className="w-7 h-7"/>
                </Button>
                <Button variant="ghost" className="w-fit h-fit px-2" onClick={goForward}>
                    <IoMdReturnRight className="w-7 h-7"/>
                </Button>
            </div>
        </div>
    )
}

export default BottomBar;