import MainTitleAnimation from "@/components/main/MainTitleAnimation";
import MainCarouselButton from "@/components/main/MainCarouselButton";

export default function MainPage() {
    return (
        <div className="flex flex-col justify-center items-center h-[100%]">
            <div className="flex w-screen h-screen justify-center items-center">
                <MainTitleAnimation/>
            </div>

            <MainCarouselButton/>
        </div>
    )
}