'use client'

import {IoIosArrowDown} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import MainCarouselAnimation from "@/components/main/MainCarouselAnimation";

const MainCarouselButton = () => {

    const carouselRef = useRef<HTMLDivElement>(null);
    const [scrollButton, setScrollButton] = useState<boolean>()

    // carouselRef위치로 스크롤 이동
    const scrollToCarousel = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    // 스크롤이 300 이하면 scrollButton 표시 / 이상이면 숨김
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 300) {
                setScrollButton(true)
            }
            if (window.scrollY < 300) {
                setScrollButton(false)
            }
        };

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 해제
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div
                onClick={scrollToCarousel}
                className={`${scrollButton ? `hidden` : `flex`} flex-col fixed bottom-20 md:bottom-10 justify-center items-center cursor-pointer`}>
                <IoIosArrowDown
                    className="absolute mb-9 w-10 h-10 sm:w-12 sm:h-12 tw-arrow-fadeIn1"/>
                <IoIosArrowDown
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 tw-arrow-fadeIn2"/>
            </div>

            <div className="flex w-screen h-screen justify-center" ref={carouselRef}>
                <MainCarouselAnimation/>
            </div>
        </>
    )
}

export default MainCarouselButton;