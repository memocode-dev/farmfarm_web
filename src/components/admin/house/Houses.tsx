'use client'

import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import formatDate from "@/utils/formatDate";
import {useFindAllHouses} from "@/openapi/api/houses/houses";
import HouseSync from "@/components/admin/house/HouseSync";

const Houses = () => {

    const router = useRouter();
    const {openModal, modalState} = useContext(ModalContext);

    const {isError, isLoading, data: housesArrayData, refetch: findAllhousesRefetch} =
        useFindAllHouses({
            query: {
                queryKey: ['Houses'],
            },
        });
    const houses = housesArrayData?.houses;


    useEffect(() => {
        if (modalState[ModalTypes.GREENHOUSE_CREATE]?.isVisible === false) {
            findAllhousesRefetch()
        }
    }, [modalState[ModalTypes.GREENHOUSE_CREATE]]);

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllhousesRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col p-2 space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => openModal({name: ModalTypes.GREENHOUSE_CREATE})}>
                        생성
                    </Button>
                </div>

                {isLoading && <div className="flex flex-col space-y-3">
                    {Array.from({length: 5}, (_, index) => (
                        <Skeleton key={index} className="h-[45px] w-full"/>
                    ))}
                </div>
                }

                {!isLoading && houses && <DataTable columns={[
                    {
                        accessorKey: "id",
                        header: "Id",
                    },
                    {
                        accessorKey: "createdAt",
                        header: "생성일",
                        cell: ({cell}) => formatDate(cell.getValue<string>())
                    },
                    {
                        accessorKey: "updatedAt",
                        header: "수정일",
                        cell: ({cell}) => formatDate(cell.getValue<string>())
                    },
                    {
                        accessorKey: "syncStatus",
                        header: "상태",
                    },
                    {
                        accessorKey: "houseSync",
                        header: "하우스 동기화",
                        cell: ({row}) => {
                            const houseId = row.original.id;
                            const syncStatus = row.original.syncStatus;
                            return (
                                <HouseSync houseId={houseId || ""} houseStatus={syncStatus || ""}/>
                            )
                        }
                    },
                ]} data={houses.map(green_house => {
                    return {
                        ...green_house,
                        onClick: () => router.push(`/admin/houses/${green_house.id}`)
                    }
                }) || []}/>}
            </div>

            {/*<GreenHouseCreateCard/>*/}
        </>
    )
}

export default Houses;