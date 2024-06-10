import AdminMenu from "@/components/admin/AdminMenu";

export default function AdminLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-1 flex-col lg:flex-row">
            <div
                className={`lg:fixed top-0 bottom-0 left-0 lg:w-[270px] flex flex-col px-[15px] lg:pt-[60px] py-[10px] space-y-1 border-r`}>
                <AdminMenu/>
            </div>

            <div className="flex-1 lg:ml-[270px]">{children}</div>
        </div>
    )
}