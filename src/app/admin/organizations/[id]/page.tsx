'use client'

import {useParams} from "next/navigation";

export default function OrganizationPage() {

    const {id} = useParams();

    return (
        <div>
            <div>Organization Detail Page</div>

            id : {id}
        </div>
    )
}