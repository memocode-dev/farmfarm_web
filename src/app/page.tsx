'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function MainPage() {
    return (
        <div>
            <div>Main Page</div>
            <Link href={"/admin"}><Button>대시보드</Button></Link>
        </div>
    )
}