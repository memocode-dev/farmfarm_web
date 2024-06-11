'use client'

import {useParams} from 'next/navigation';
import {useFindAllGreenhouseSection} from "@/openapi/api/greenhouses/greenhouses";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

const GreenHouseSections = () => {

    const params = useParams();
    const greenHouseId = params.id;

    const {isError, isLoading, data: green_house_sections, refetch} =
        useFindAllGreenhouseSection(greenHouseId as string, {
            query: {
                queryKey: ['GreenHouseSections'],
            },
        });

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => refetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">

            {isLoading &&
                Array.from({length: 10}, (_, index) => (
                    <Skeleton key={index} className="min-h-[350px]"/>
                ))
            }

            {green_house_sections && green_house_sections?.map((green_house_section, index) => {
                console.log(green_house_section)
                return (
                    <div className="flex flex-col">
                        <div className="text-center">{green_house_section.sectionNumber}동</div>
                        <div
                            className="flex flex-col scale-100 bg-secondary hover:cursor-pointer">
                            <div
                                className="flex-1 flex flex-col scale-100 min-h-[350px]">
                                {green_house_section.greenhouse?.organization.name}
                            </div>
                        </div>
                    </div>
                )
            })}


            {
                Array.from({length: 13}, (_, index) => (
                    <div className="flex flex-col">
                        <div className="text-center">동 번호</div>
                        <div
                            className="flex flex-col scale-100 bg-secondary hover:cursor-pointer">
                            <div
                                className="flex-1 flex flex-col scale-100 min-h-[350px]">
                                테스트 섹션입니다.
                            </div>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default GreenHouseSections;