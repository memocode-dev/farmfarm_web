'use client'

import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Button} from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import formatDate from "@/utils/formatDate";
import {useFindAllHouses} from "@/openapi/api/houses/houses";
import HouseSync from "@/components/admin/house/HouseSync";
import HouseCreateModal from "@/components/admin/house/HouseCreateModal";
import {ColumnDef} from "@tanstack/react-table";
import {type FindAllHousesResponseHouse} from "@/openapi/model";
import {Skeleton} from "@/components/ui/skeleton";

const Houses = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const router = useRouter();
    const {openModal, modalState} = useContext(ModalContext);

    const {isError, isLoading, data: housesArrayData, refetch: findAllHousesRefetch} =
        useFindAllHouses({
            query: {
                queryKey: ['Houses'],
            },
        });
    const houses = housesArrayData?.houses;

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_CREATE]?.isVisible === false) {
            findAllHousesRefetch()
        }
    }, [modalState[ModalTypes.HOUSE_CREATE]]);

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllHousesRefetch()}>재시도</Button>
            </div>
        )
    }


    return (
        <>
            <div className="flex flex-col p-2 space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => openModal({name: ModalTypes.HOUSE_CREATE})}>
                        생성
                    </Button>
                </div>

                {isLoading && <div className="flex flex-col space-y-3">
                    {Array.from({length: 5}, (_, index) => (
                        <Skeleton key={index} className="h-[45px] w-full"/>
                    ))}
                </div>}

                {!isLoading && <div style={width < 1024 ? { width: width - 20 } : {}} className="overflow-x-auto">
                    <div className={`${width < 1024 ? "w-[1000px]" : "w-full"}`}>
                        <DataTable
                            columns={[
                                {
                                    accessorKey: "id",
                                    header: () => <div className="text-center">Id</div>,
                                    cell: ({ cell }) => <div className="text-center">{cell.getValue<string>()}</div>,
                                },
                                {
                                    accessorKey: "name",
                                    header: () => <div className="text-center">하우스명</div>,
                                    cell: ({ cell }) => <div className="text-center">{cell.getValue<string>()}</div>,
                                },
                                {
                                    accessorKey: "createdAt",
                                    header: () => <div className="text-center">생성일</div>,
                                    cell: ({ cell }) => <div className="text-center">{formatDate(cell.getValue<string>())}</div>,
                                },
                                {
                                    accessorKey: "updatedAt",
                                    header: () => <div className="text-center">수정일</div>,
                                    cell: ({ cell }) => <div className="text-center">{formatDate(cell.getValue<string>())}</div>,
                                },
                                {
                                    accessorKey: "syncStatus",
                                    header: () => <div className="text-center">상태</div>,
                                    cell: ({ cell }) => <div className="text-center">{cell.getValue<string>()}</div>,
                                },
                                {
                                    accessorKey: "houseSync",
                                    header: () => <div className="text-center">하우스 동기화</div>,
                                    cell: ({ row }) => {
                                        const houseId = row.original.id;
                                        const syncStatus = row.original.syncStatus;
                                        return (
                                            <div className="flex justify-center">
                                                <HouseSync houseId={houseId || ""} houseStatus={syncStatus || ""} />
                                            </div>
                                        )
                                    },
                                },
                            ]}
                            data={houses?.map(house => {
                                return {
                                    ...house,
                                    onClick: () => router.push(`/admin/houses/${house.id}`)
                                }
                            }) || []}
                            initialState={{
                                columnVisibility: {
                                    id: width > 1024,
                                    createdAt: width > 1024,
                                    updatedAt: width > 1024,
                                },
                            }}
                        />
                    </div>
                </div>}
            </div>

            <HouseCreateModal/>
        </>
    )
}

export default Houses;