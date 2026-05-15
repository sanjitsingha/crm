"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "../DashboardLayout";
import { supabase } from "@/lib/supabase";

import {
    Search,
    Plus,
    Settings2,
} from "lucide-react";

export default function lead() {

    const router = useRouter();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showColumnDropdown, setShowColumnDropdown] = useState(false);

    const dropdownRef = useRef(null);

    // Default visible columns
    const [selectedColumns, setSelectedColumns] = useState([
        "full_name",
        "phone_number",
        "interested_department",
        "lead_status",
        "preferred_visit_date",
    ]);

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowColumnDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    async function fetchLeads() {

        try {

            setLoading(true);

            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            setLeads(data || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    const allColumns = useMemo(() => {

        if (!leads.length) return [];

        return Object.keys(leads[0]).filter(
            (key) =>
                key !== "id" &&
                key !== "created_at" &&
                key !== "updated_at"
        );

    }, [leads]);

    function toggleColumn(column) {

        setSelectedColumns((prev) => {

            if (prev.includes(column)) {
                return prev.filter((item) => item !== column);
            }

            return [...prev, column];
        });
    }

    const filteredLeads = leads.filter((lead) =>
        Object.values(lead).some((value) =>
            String(value || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    );

    function formatHeading(text) {

        return text
            .replaceAll("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function renderCell(column, value) {

        // Status Badge
        if (column === "lead_status") {

            return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${value === "New"
                            ? "bg-blue-100 text-blue-700"
                            : value === "Interested"
                                ? "bg-yellow-100 text-yellow-700"
                                : value === "Converted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {value || "-"}
                </span>
            );
        }

        return (
            <span className="text-sm text-gray-700">
                {value || "-"}
            </span>
        );
    }

    return (

        <DashboardLayout>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Leads
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage all healthcare leads
                    </p>

                </div>

                <Link
                    href="/dashboard/lead/add"
                    className="h-11 px-5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition"
                >

                    <Plus size={18} />

                    Add Lead

                </Link>

            </div>

            {/* Filters */}
            <div className="bg-white border rounded-2xl p-4 mb-6">

                <div className="flex items-center justify-between gap-4 flex-wrap">

                    {/* Left Side */}
                    <div className="flex items-center gap-4 flex-wrap">

                        {/* Search */}
                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="h-11 w-72 rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                    {/* Column Selector */}
                    <div className="relative" ref={dropdownRef}>

                        <button
                            onClick={() =>
                                setShowColumnDropdown(!showColumnDropdown)
                            }
                            className="h-11 w-11 rounded-xl border flex items-center justify-center hover:bg-gray-100"
                        >

                            <Settings2 size={18} />

                        </button>

                        {showColumnDropdown && (

                            <div className="absolute right-0 top-14 w-72 bg-white border rounded-2xl shadow-lg p-4 z-50">

                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    Select Columns
                                </p>

                                <div className="space-y-2 max-h-80 overflow-y-auto">

                                    {allColumns.map((column) => (

                                        <label
                                            key={column}
                                            className="flex items-center gap-3 text-sm cursor-pointer"
                                        >

                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.includes(column)}
                                                onChange={() =>
                                                    toggleColumn(column)
                                                }
                                            />

                                            {formatHeading(column)}

                                        </label>

                                    ))}

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* Table */}
            <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                {selectedColumns.map((column) => (

                                    <th
                                        key={column}
                                        className="text-left p-4 text-sm font-semibold text-gray-600 whitespace-nowrap"
                                    >

                                        {formatHeading(column)}

                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan={selectedColumns.length}
                                        className="p-10 text-center text-gray-500"
                                    >
                                        Loading leads...
                                    </td>
                                </tr>

                            ) : filteredLeads.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={selectedColumns.length}
                                        className="p-10 text-center text-gray-500"
                                    >
                                        No leads found.
                                    </td>
                                </tr>

                            ) : (

                                filteredLeads.map((lead) => (

                                    <tr
                                        key={lead.id}
                                        onClick={() =>
                                            router.push(`/dashboard/lead/edit/${lead.id}`)
                                        }
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >

                                        {selectedColumns.map((column) => (

                                            <td
                                                key={column}
                                                className="p-4 whitespace-nowrap"
                                            >

                                                {renderCell(
                                                    column,
                                                    lead[column]
                                                )}

                                            </td>

                                        ))}

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>
    );
}