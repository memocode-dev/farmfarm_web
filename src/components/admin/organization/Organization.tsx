import {useParams} from "next/navigation";

const Organization = () => {

    // const organizationId = useParams();

    return (
        <div className="flex items-center flex-col space-y-4 p-4">
            Organization Detail
            {/*<OrganizationUpdateCard organizationId={organizationId}/>*/}
            {/*<OrganizationMembers organizationId={organizationId ? organizationId : ""}/>*/}
            {/*<OrganizationHouses organizationId={organizationId ? organizationId : ""}/>*/}
        </div>
    )
}

export default Organization;