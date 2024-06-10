import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {FaTemperatureHigh} from "react-icons/fa";
import {GiGreenhouse, GiOrganigram} from "react-icons/gi";
import {forwardRef, useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";


const MainCarouselAnimation = forwardRef<HTMLDivElement, Record<string, never>>((_, ref) => {

    const carouselTexts = [
        {
            content: "온도 자동 모니터링 시스템",
            description: "실시간 온도 데이터 관찰 및 스마트폰 간편 조회로 언제 어디서나 하우스 상태를 확인 할 수 있습니다.",
            icon: <FaTemperatureHigh className="w-20 h-20"/>
        },
        {
            content: "자동 개폐 시스템",
            description: "스마트폰을 이용한 개폐기 자동 제어로 최적의 환경을 유지할 수 있습니다.",
            icon: <GiGreenhouse className="w-20 h-20"/>
        },
        {
            content: "관리자 및 조직 조회 시스템",
            description: "각 하우스의 소속 관리자와 조직을 개별적으로 관리하여 한 눈에 조회 할 수 있습니다.",
            icon: <GiOrganigram className="w-20 h-20"/>
        },
    ];

    const [opacity, setOpacity] = useState(0)
    const [scale, setScale] = useState(50)
    const [startedScrolling, setStartedScrolling] = useState(false)

    // 스크롤 시작 시 carousel 크기, 투명도 설정
    const handleScroll = () => {
        if (!startedScrolling) setStartedScrolling(true);

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        if (startedScrolling) {
            const newOpacity = Math.min(1, scrollY / (windowHeight / 20));
            const newScale = 50 + (scrollY / (windowHeight / 20)) * 50;

            setOpacity(newOpacity);
            setScale(Math.min(100, newScale));
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [startedScrolling])

    return (
        <div
            ref={ref}
            className="flex justify-center items-center relative my-40 sm:my-32 w-[80%] bg-white p-1"
            style={{
                opacity: startedScrolling ? opacity : 0,
                transform: `scale(${scale / 100})`,
                transition: 'opacity 1s, transform 1s'
            }}
        >
            <Carousel opts={{align: "start"}} className="w-full">
                <CarouselContent>
                    {carouselTexts.map((text, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="bg-gray-50 border-none">
                                    <CardContent className="flex flex-col space-y-4 justify-center aspect-square p-6">
                                        <span className="text-2xl font-semibold">{text.content}</span>
                                        <span className="text-lg font-medium">{text.description}</span>

                                        <div className="flex justify-end">{text.icon}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="absolute -bottom-14 sm:-bottom-24 right-1/2">
                    <CarouselPrevious/>
                    <CarouselNext/>
                </div>
            </Carousel>
        </div>
    )
});

export default MainCarouselAnimation;