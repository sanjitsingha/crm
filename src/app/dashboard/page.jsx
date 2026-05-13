import DashboardLayout from "./DashboardLayout";

export default function page() {
    return (
        <DashboardLayout>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard Overview
            </h2>

            <div className="grid grid-cols-4 gap-6">

                <div className="rounded-2xl bg-white border p-6">
                    <p className="text-sm text-gray-500">
                        Total Leads
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-black">
                        128
                    </h3>
                </div>

                <div className="rounded-2xl bg-white border p-6">
                    <p className="text-sm text-gray-500">
                        Today Leads
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-black">
                        12
                    </h3>
                </div>

                <div className="rounded-2xl bg-white border p-6">
                    <p className="text-sm text-gray-500">
                        Follow-ups
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-black">
                        34
                    </h3>
                </div>

                <div className="rounded-2xl bg-white border p-6">
                    <p className="text-sm text-gray-500">
                        Converted
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-black">
                        56
                    </h3>
                </div>

            </div>

        </DashboardLayout>
    );
}