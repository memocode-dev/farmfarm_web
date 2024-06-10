'use client'

import {animated, useTransition} from "@react-spring/web";
import {useCallback, useEffect, useRef, useState} from "react";

const MainTitleAnimation = () => {

    const ref = useRef<ReturnType<typeof setTimeout>[]>([])
    const [items, set] = useState<string>()

    const transitions = useTransition(items, {
        from: {
            opacity: 0,
            height: 0,
            innerHeight: 0,
            transform: 'perspective(600px) rotateX(0deg)',
            color: '#8fa5b6',
        },
        enter: [
            {opacity: 1, height: 60, innerHeight: 60},
            {transform: 'perspective(600px) rotateX(180deg)', color: '#28d79f'},
            {transform: 'perspective(600px) rotateX(0deg)'},
        ],
        leave: [{color: '#0F172A'}, {innerHeight: 0}, {opacity: 0, height: 0}],
        update: {color: '#28b4d7'},
    })

    const reset = useCallback(() => {
        ref.current.forEach(clearTimeout)
        ref.current = []
        set("")
        ref.current.push(setTimeout(() => set("FARM FARM"), 500))
    }, [])

    useEffect(() => {
        reset()
        return () => ref.current.forEach(clearTimeout)
    }, [])

    return (
        <div className="min-w-[100px] px-5 mx-auto h-[260px]">
            {transitions(({innerHeight, ...rest}, item) => (
                <animated.div
                    className="overflow-hidden w-full text-white flex justify-start
                                    items-center text-4xl sm:text-7xl font-extrabold uppercase will-change-transform
                                      opacity height whitespace-nowrap cursor-pointer leading-[80px]"
                    style={rest} onClick={reset}>
                    <animated.div
                        style={{overflow: 'hidden', height: innerHeight}}
                        className="tracking-wide"
                    >
                        {item}
                    </animated.div>
                </animated.div>
            ))}
        </div>
    )
}

export default MainTitleAnimation;