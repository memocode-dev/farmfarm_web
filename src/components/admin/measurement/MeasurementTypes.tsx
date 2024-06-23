// 'use client'
//
// import {Button} from "@/components/ui/button";
// import {Skeleton} from "@/components/ui/skeleton";
// import DataTable from "@/components/common/DataTable";
// import {useFindAllMeasurementType} from "@/openapi/api/measurement/measurement";
// import {useRouter} from "next/navigation";
// import {ModalContext, ModalTypes} from "@/context/ModalConext";
// import {useContext} from "react";
// import MeasurementTypeCreateCard from "@/components/admin/measurement/MeasurementTypeCreateCard";
//
// const MeasurementTypes = () => {
//
//     const {openModal} = useContext(ModalContext);
//     const router = useRouter();
//
//     const {isError, isLoading, data: measurement_types, refetch} = useFindAllMeasurementType({
//         query: {
//             queryKey: ['MeasurementTypes'],
//         },
//     });
//
//     if (isError) {
//         return (
//             <div className="flex space-x-4">
//                 <div>잠시후에 다시 시도해주세요</div>
//                 <Button onClick={() => refetch()}>재시도</Button>
//             </div>
//         )
//     }
//
//     return (
//         <>
//             <div className="flex flex-col p-2 space-y-2">
//                 <div className="flex justify-end">
//                     <Button
//                         onClick={() => openModal({name: ModalTypes.MEASUREMENT_TYPE_CREATE})
//                         }>
//                         생성
//                     </Button>
//                 </div>
//
//                 {isLoading && <div className="flex flex-col space-y-3">
//                     {Array.from({length: 5}, (_, index) => (
//                         <Skeleton key={index} className="h-[45px] w-full"/>
//                     ))}
//                 </div>}
//                 {!isLoading && <DataTable columns={[
//                     {
//                         accessorKey: "id",
//                         header: "Id",
//                     },
//                     {
//                         accessorKey: "type",
//                         header: "측정타입",
//                     },
//                 ]} data={measurement_types ? measurement_types.map(measurement_type => {
//                     return {
//                         origin: {...measurement_type},
//                         id: measurement_type.id,
//                         type: measurement_type.type,
//                         onClick: () => router.push(`/admin/measurement/${measurement_type.id}`)
//                     }
//                 }) : []}/>}
//             </div>
//
//             <MeasurementTypeCreateCard/>
//         </>
//     )
// }
//
// export default MeasurementTypes;