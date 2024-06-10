import MainTitleAnimation from "@/components/main/MainTitleAnimation";
import dynamic from "next/dynamic";

export default function MainPage() {

    // 클라이언트 사이드 렌더링을 위해 컴포넌트를 동적 import로 가져옴
    const MainCarouselButton = dynamic(() => import('@/components/main/MainCarouselButton'), {
        ssr: false // 이 컴포넌트는 클라이언트 사이드에서만 렌더링됨
    });

    return (
        <div className="flex flex-col justify-center items-center h-[100%]">
            <div className="flex w-screen h-screen justify-center items-center">
                <MainTitleAnimation/>
            </div>

            <MainCarouselButton/>
        </div>
    )
}