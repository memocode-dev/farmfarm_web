'use client'

import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext} from "react";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import {useFindAllOrganizations} from "@/openapi/api/organizations/organizations";
import OrganizationCreateModal from "@/components/admin/organization/OrganizationCreateModal";

const Organizations = () => {

    const {openModal} = useContext(ModalContext);
    const router = useRouter();

    const {isError, isLoading, data: organizationsArrayData, refetch} = useFindAllOrganizations({
        query: {
            queryKey: ['Organizations'],
        },
    });
    const organizations = organizationsArrayData?.organizations;

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => refetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-end">
                <Button
                    onClick={() => openModal({name: ModalTypes.ORGANIZATION_CREATE})}
                >
                    생성
                </Button>
            </div>

            {isLoading &&
                <div className="flex flex-col space-y-3">
                    {Array.from({length: 5}, (_, index) => (
                        <Skeleton key={index} className="h-[45px] w-full"/>
                    ))}
                </div>
            }

            <div>
                {!isLoading && <DataTable columns={[
                    {
                        accessorKey: "id",
                        header: () => <div className="text-center">Id</div>,
                        cell: ({cell}) => <div className="text-center">{cell.getValue<string>()}</div>,
                    },
                    {
                        accessorKey: "name",
                        header: () => <div className="text-center w-[130px]">조직명</div>,
                        cell: ({cell}) => <div className="text-center w-[130px]">{cell.getValue<string>()}</div>,
                    },
                ]} data={organizations?.map((organization) => {
                    return {
                        ...organization,
                        onClick: () => router.push(`/admin/organizations/${organization.id}`)
                    }
                }) || []}/>}
            </div>

            <OrganizationCreateModal/>
        </>
    )
}

export default Organizations;