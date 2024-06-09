'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function MainPage() {
    console.log(process.env);
    return (
        <div>
            <div>Main Page</div>
            <Link href={"/admin"}><Button>대시보드</Button></Link>
            <div>{process.env.NEXT_PUBLIC_FARMFARM_SERVER_URL}</div>
        </div>
    )
}