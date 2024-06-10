'use client'

import {Button} from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";

interface Menu {
    path: string;
    name: string;
}

const menus: Menu[] = [
    {
        path: "/",
        name: "홈",
    },
    {
        path: "/admin",
        name: "대시보드",
    },
    {
        path: "/admin/api",
        name: "API 문서",
    },
    {
        path: "/admin/users",
        name: "유저",
    },
    {
        path: "/admin/organizations",
        name: "조직",
    },
    {
        path: "/admin/houses",
        name: "하우스",
    },
    {
        path: "/admin/sensors",
        name: "센서",
    },
    {
        path: "/admin/sensor_types",
        name: "센서타입",
    },
]

const AdminMenu = () => {

    const router = useRouter();
    const currentPath = usePathname();

    const isActive = (path: string) => {
        return currentPath === path;
    };

    return (
        menus.map((menu, index) => {
            return (
                <Button
                    variant={isActive(menu.path) ? "default" : "ghost"}
                    onClick={() => {
                        router.push(menu.path)
                    }}>
                    {menu.name}
                </Button>
            )
        })
    )
}

export default AdminMenu;