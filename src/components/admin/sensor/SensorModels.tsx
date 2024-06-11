'use client'

import {useCreateSensorModel, useFindAllSensorModel} from "@/openapi/api/sensors/sensors";
import {Skeleton} from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import {SensorModelCreateForm} from "@/openapi/model";
import {Controller, useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {useFindAllMeasurementType} from "@/openapi/api/measurement/measurement";
import {Badge} from "@/components/ui/badge";

const SensorModels = () => {

    const router = useRouter();

    const {
        isLoading: isFindAllSensorModelsLoading,
        data: sensor_models,
        refetch: findAllSensorModelsRefetch
    } = useFindAllSensorModel({
        query: {
            queryKey: ['SensorModels'],
        },
    })

    const {
        data: measurement_types,
        refetch: findAllMeasurementTypesRefetch,
    } = useFindAllMeasurementType({
        query: {
            queryKey: ['MeasurementTypes'],
        },
    });

    const {
        mutate: createSensorModel,
    } = useCreateSensorModel({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "센서 모델 생성",
                    description: "성공적으로 센서모델이 생성되었습니다.",
                })
                findAllSensorModelsRefetch();
                findAllMeasurementTypesRefetch();
                reset();
            },
            onError: (error) => {
                console.log(error)
                toast({
                    variant: "destructive",
                    description: "관리자에게 문의하세요."
                });
            },
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
    } = useForm<SensorModelCreateForm>();

    const onSubmit = (data: SensorModelCreateForm) => createSensorModel({data: data});

    return (
        <div className="flex flex-col p-2 space-y-2">
            <form className="w-full mx-auto space-x-4 my-[20px] relative max-w-md"
                  onSubmit={handleSubmit(onSubmit, () => {
                      toast({
                          variant: "destructive",
                          description: "필수 항목을 확인해주세요."
                      });
                  })}>
                <div className="flex flex-col space-y-4">
                    <div className="flex space-x-2 items-center">
                        <Label htmlFor="modelName" className="w-[70px]">센서명</Label>
                        <Input type="text"
                               id="modelName"
                               placeholder="센서명을 작성해주세요."
                               {...register("modelName", {required: "센서명을 작성해주세요."})}
                        />
                        <Button>생성</Button>
                    </div>

                    <div className="flex flex-col space-y-2 rounded border p-4">
                        <div className="flex items-center space-x-1">
                            <Badge>Type</Badge>
                            <div className="text-xs text-muted-foreground">측정 타입을 선택하세요.</div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            {measurement_types?.map((measurement_type, index) => (
                                <Controller
                                    key={index}
                                    name="measurementTypeIds"
                                    control={control}
                                    render={({field}) => (
                                        <div className="flex items-center space-x-1">
                                            <Checkbox
                                                id={measurement_type.id}
                                                value={measurement_type.id}
                                                checked={field.value?.includes(measurement_type.id) || false}
                                                onCheckedChange={() => {
                                                    const value = field.value || [];
                                                    const newValue = value.includes(measurement_type.id)
                                                        ? value.filter((i) => i !== measurement_type.id)
                                                        : [...value, measurement_type.id];
                                                    field.onChange(newValue);
                                                }}
                                            />
                                            <label htmlFor={measurement_type.id}>
                                                {measurement_type.type}
                                            </label>
                                        </div>

                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </form>

            {isFindAllSensorModelsLoading &&
                <div className="flex flex-col space-y-3">
                    {Array.from({length: 5}, (_, index) => (
                        <Skeleton key={index} className="h-[45px] w-full"/>
                    ))}
                </div>
            }

            {!isFindAllSensorModelsLoading && <DataTable columns={[
                {
                    accessorKey: "id",
                    header: "Id",
                },
                {
                    accessorKey: "modelName",
                    header: "Name",
                },
            ]} data={sensor_models ? sensor_models.map(sensor_model => {
                return {
                    origin: {...sensor_model},
                    id: sensor_model.id,
                    modelName: sensor_model.modelName,
                    onClick: () => router.push(`/admin/sensors/${sensor_model.id}`)
                }
            }) : []}/>}
        </div>
    )
}

export default SensorModels;