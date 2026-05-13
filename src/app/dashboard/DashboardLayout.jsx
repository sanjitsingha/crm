import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}