'use client'

import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {

    const pathname = usePathname();

    return (
        <aside className="w-20 bg-white border-r flex flex-col items-center py-6">

            {/* Logo */}
            <div className="mb-10">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    K
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col items-center gap-4">

                <Link href="/dashboard" className={`h-12 w-12 rounded-xl flex items-center justify-center transition flex-col ${pathname === "/dashboard"
                    ? "text-blue-600" : "text-gray-400 "
                    }`}>

                    <LayoutDashboard size={24} />
                    <p className="text-xs mt-1"> Dashboard</p>

                </Link>


                <Link href="/dashboard/lead" className={`h-12 w-12 rounded-xl flex items-center justify-center transition flex-col ${pathname.startsWith("/dashboard/lead")
                    ? "text-blue-600" : "text-gray-400 "
                    }`}>

                    <LayoutDashboard size={24} />
                    <p className="text-xs mt-1"> Leads</p>

                </Link>

                <Link href="/dashboard/patient" className={`h-12 w-12 rounded-xl flex items-center justify-center transition flex-col ${pathname.startsWith("/dashboard/patient")
                    ? "text-blue-600" : "text-gray-400 "
                    }`}>

                    <LayoutDashboard size={24} />
                    <p className="text-xs mt-1"> Patients</p>

                </Link>

            </nav>
        </aside>
    );
}