'use client'

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const segments = pathname.split('/').filter(Boolean);

    // Always take the segment after dashboard
    const currentPage = segments[1] || 'dashboard';

    const title =
        currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    return (
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
                {title}
            </h1>
        </header>
    );
}