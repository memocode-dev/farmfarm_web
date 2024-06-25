'use client'

import {Skeleton} from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import {useFindAllSensorModels} from "@/openapi/api/sensors/sensors";
import {ModalTypes} from "@/context/ModalConext";
import formatDate from "@/utils/formatDate";
import HouseSync from "@/components/admin/house/HouseSync";
import {Separator} from "@/components/ui/separator";
import {RiCelsiusLine, RiPercentLine} from "react-icons/ri";

const SensorModels = () => {

    const router = useRouter();

    const {
        isError,
        isLoading,
        data: sensorModels,
        refetch: findAllSensorModelsRefetch
    }
        = useFindAllSensorModels({
        query: {
            queryKey: ['SensorModels'],
        },
    })

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findAllSensorModelsRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col p-2">

            {isLoading && <div className="flex flex-col space-y-3">
                {Array.from({length: 5}, (_, index) => (
                    <Skeleton key={index} className="h-[45px] w-full"/>
                ))}
            </div>}

            {/*{!isLoading && <div style={width < 1024 ? {width: width - 20} : {}} className="overflow-x-auto">*/}
            {/*    <div className={`${width < 1024 ? "w-[1000px]" : "w-full"}`}>*/}

            {!isLoading && <DataTable
                columns={[
                    {
                        accessorKey: "name",
                        header: () => <div className="text-center">name</div>,
                        cell: ({cell}) => <div className="text-center">{cell.getValue<string>()}</div>,
                    },
                    {
                        accessorKey: "description",
                        header: () => <div className="text-center">설명</div>,
                        cell: ({cell}) => <div className="text-center">{cell.getValue<string>()}</div>,
                    },
                    {
                        accessorKey: "measurementDetails",
                        header: () => <div className="text-center">측정 상세정보</div>,
                        cell: ({row}) => {
                            const measurementDetails = row.original.measurementDetails;
                            return (
                                <div className="flex flex-col items-center">
                                    {measurementDetails?.map((measurementDetail, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div>{measurementDetail.measurementType}</div>
                                            <Separator orientation="vertical" className="h-5"/>
                                            <div className="flex items-center space-x-1">
                                                <div>{measurementDetail.measurementUnit}</div>
                                                {measurementDetail.measurementUnit === "CELSIUS" &&
                                                    <RiCelsiusLine className="w-4 h-4"/>}
                                                {measurementDetail.measurementUnit === "PERCENT" &&
                                                    <RiPercentLine className="w-4 h-4"/>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    },
                ]}
                data={sensorModels?.map(sensorModel => {
                    return {
                        ...sensorModel
                    }
                }) || []}
                // initialState={{
                //     columnVisibility: {
                //         id: width > 1024,
                //         createdAt: width > 1024,
                //         updatedAt: width > 1024,
                //     },
                // }}
            />
            }
        </div>
        // </div>
        // }
        // </div>
    )
}

export default SensorModels;