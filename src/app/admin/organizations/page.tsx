'use client'

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function OrganizationsPage() {

    const router = useRouter();

    const handleOrganizationId = (id: number) => {
        router.push(`/admin/organizations/${id}`);
    }

    return (
        <div>
            <div>Organizations Page</div>

            <Button onClick={() => {handleOrganizationId(1)}}>
                조직 1
            </Button>

            <Button onClick={() => {handleOrganizationId(2)}}>
                조직 2
            </Button>
        </div>
    )
}