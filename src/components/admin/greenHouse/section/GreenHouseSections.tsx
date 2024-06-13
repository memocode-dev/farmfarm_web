'use client'

import {useParams} from 'next/navigation';
import {useFindAllGreenhouseSection} from "@/openapi/api/greenhouses/greenhouses";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import GreenHouseSectionCreateCard from "@/components/admin/greenHouse/section/GreenHouseSectionCreateCard";
import GreenHouseSectionSensorCreateCard from "@/components/admin/greenHouse/section/GreenHouseSectionSensorCreateCard";
import GreenHouseSection from "@/components/admin/greenHouse/section/GreenHouseSection";

const GreenHouseSections = () => {

    const {openModal} = useContext(ModalContext);
    const params = useParams();
    const greenHouseId = params.id;

    const [createdGreenHouseSectionId, setCreatedGreenHouseSectionId] = useState<string>(); // 새로 생성된 동 id

    const {isError, isLoading, data: green_house_sections, refetch: findAllGreenhouseSectionRefetch} =
        useFindAllGreenhouseSection(greenHouseId as string, {
            query: {
                queryKey: ['GreenHouseSections'],
            },
        });

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllGreenhouseSectionRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex-1 p-2">
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground"
                        onClick={() => openModal({
                            name: ModalTypes.GREENHOUSE_SECTION_CREATE,
                            data: greenHouseId as string,
                        })}
                    >
                        하우스 동 생성
                    </Button>

                    <Button
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground"
                        onClick={() => openModal({
                            name: ModalTypes.GREENHOUSE_SECTION_SENSOR_CREATE,
                            data: greenHouseId as string,
                        })}
                    >
                        하우스 동 센서 생성
                    </Button>
                </div>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12 p-5">

                    {isLoading &&
                        Array.from({length: 10}, (_, index) => (
                            <Skeleton key={index} className="min-h-[330px]"/>
                        ))
                    }

                    {green_house_sections && green_house_sections?.map((green_house_section, index) => {
                        return (
                            <div
                                className={`flex flex-col ${createdGreenHouseSectionId === green_house_section.id ? 'slide-in-up' : ''}`}
                                key={index}>
                                <GreenHouseSection
                                    green_house_section={green_house_section}
                                    greenHouseId={greenHouseId as string}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            <GreenHouseSectionCreateCard setCreatedGreenHouseSectionId={setCreatedGreenHouseSectionId}/>
            <GreenHouseSectionSensorCreateCard/>
        </>
    )
}

export default GreenHouseSections;