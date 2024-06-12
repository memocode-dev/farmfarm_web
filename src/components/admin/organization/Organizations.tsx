'use client'

import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {useContext} from "react";
import {useFindAllOrganization} from "@/openapi/api/organizations/organizations";
import DataTable from "@/components/common/DataTable";
import {useRouter} from "next/navigation";
import OrganizationCreateCard from "@/components/admin/organization/OrganizationCreateCard";

const Organizations = () => {

    const {openModal} = useContext(ModalContext);
    const router = useRouter();

    const {isError, isLoading, data: organizations, refetch} = useFindAllOrganization({
        query: {
            queryKey: ['Organizations'],
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
        <>
            <div className="flex justify-end">
                <Button
                    onClick={() => openModal({name: ModalTypes.ORGANIZATION_CREATE})
                    }>
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
                        header: "Id",
                    },
                    {
                        accessorKey: "name",
                        header: "조직명",
                    },
                ]} data={organizations?.map((organization) => {
                    return {
                        ...organization,
                        onClick: () => router.push(`/admin/organizations/${organization.id}`)
                    }
                }) || []}/>}
            </div>

            <OrganizationCreateCard/>
        </>
    )
}

export default Organizations;