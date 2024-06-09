import Link from "next/link";

export default function OrganizationsPage() {
    return (
        <div>
            <div>Organizations Page</div>

            <Link href={"/admin/organizations/1"}>조직 1</Link>

            <Link href={"/admin/organizations/2"}>조직 1</Link>
        </div>
    )
}