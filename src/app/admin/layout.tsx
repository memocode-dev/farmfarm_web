import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function AdminLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex">
            <div className="flex flex-col">
                <Link href={"/"}><Button>홈</Button></Link>
                <Link href={"/admin/api"}><Button>API 문서</Button></Link>
                <Link href={"/admin/users"}><Button>유저</Button></Link>
                <Link href={"/admin/organizations"}><Button>조직</Button></Link>
                <Link href={"/admin/houses"}><Button>하우스</Button></Link>
                <Link href={"/admin/sensors"}><Button>센서</Button></Link>
                <Link href={"/admin/sensor_types"}><Button>센서타입</Button></Link>
            </div>

            <div>{children}</div>
        </div>
    )
}