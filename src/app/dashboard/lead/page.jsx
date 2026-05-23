"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "../DashboardLayout";
import { supabase } from "@/lib/supabase";

import {
    Search,
    Plus,
    FunnelPlus,
    Trash2,
    MoveRight
} from "lucide-react";

export default function Lead() {

    const router = useRouter();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showColumnDropdown, setShowColumnDropdown] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    const dropdownRef = useRef(null);

    // Default visible columns
    const [selectedColumns, setSelectedColumns] = useState([
        "full_name",
        "phone_number",
        "interested_department",
        "lead_status",
        "tags",
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
                .select("*, lead_tags(tags(id, name, color))")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            const formattedLeads = (data || []).map((lead) => ({
                ...lead,
                tags:
                    lead.lead_tags?.map((lt) => lt.tags).filter(Boolean) || []
            }));

            setLeads(formattedLeads);

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
                key !== "updated_at" &&
                key !== "lead_tags"
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

    function toggleRow(id) {

        setSelectedRows((prev) => {

            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }

            return [...prev, id];
        });
    }

    function toggleSelectAll() {

        if (selectedRows.length === filteredLeads.length) {

            setSelectedRows([]);

        } else {

            setSelectedRows(filteredLeads.map((lead) => lead.id));
        }
    }

    async function handleDeleteSelected() {

        if (selectedRows.length === 0) return;

        const confirmDelete = confirm(
            `Delete ${selectedRows.length} selected leads?`
        );

        if (!confirmDelete) return;

        try {

            const { error } = await supabase
                .from("leads")
                .delete()
                .in("id", selectedRows);

            if (error) {
                console.error(error);
                return;
            }

            setLeads((prev) =>
                prev.filter((lead) => !selectedRows.includes(lead.id))
            );

            setSelectedRows([]);

        } catch (error) {

            console.error(error);
        }
    }

    async function handleMoveToPatient() {

        if (selectedRows.length === 0) return;

        try {

            const selectedLeadData = leads.filter((lead) =>
                selectedRows.includes(lead.id)
            );

            const patientData = selectedLeadData.map((lead) => {

                const {
                    id,
                    created_at,
                    updated_at,
                    lead_tags,
                    ...rest
                } = lead;

                return rest;
            });

            const { error } = await supabase
                .from("patients")
                .insert(patientData);

            if (error) {
                console.error(error);
                return;
            }

            await supabase
                .from("leads")
                .delete()
                .in("id", selectedRows);

            setLeads((prev) =>
                prev.filter((lead) => !selectedRows.includes(lead.id))
            );

            setSelectedRows([]);

        } catch (error) {

            console.error(error);
        }
    }

    const filteredLeads = leads.filter((lead) =>
        Object.entries(lead).some(([key, value]) => {

            if (key === "tags" && Array.isArray(value)) {

                return value.some((tag) =>
                    tag.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            }

            return String(value || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        })
    );

    function formatHeading(text) {

        return text
            .replaceAll("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function renderCell(column, value) {

        // Tags
        if (column === "tags") {

            return (
                <div className="flex flex-wrap gap-1">

                    {value && value.length > 0 ? (

                        value.map((tag) => (

                            <span
                                key={tag.id}
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white whitespace-nowrap"
                                style={{
                                    backgroundColor:
                                        tag.color || "#3b82f6"
                                }}
                            >

                                {tag.name}

                            </span>

                        ))

                    ) : (

                        <span className="text-gray-400">-</span>

                    )}

                </div>
            );
        }

        // Lead Status
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
<div className="p-4">


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
                    className="h-11 px-3 bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#4f46e5] rounded-sm text-white flex items-center gap-2"
                >

                    <Plus size={18} />

                    <p className="text-sm border-l border-blue-800 pl-3">
                        Add Lead
                    </p>

                </Link>

            </div>

            {/* Filters */}
            <div className="bg-white border py-2 px-4 mb-1">

                <div className="flex items-center justify-between gap-4 flex-wrap">

                    {/* Search */}
                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
                        />

                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="h-11 w-72 text-black text-sm border-b border-gray-200 pl-10 pr-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Right Actions */}
                    <div
                        className="flex items-center"
                        ref={dropdownRef}
                    >

                        {/* Selected Actions */}
                        {selectedRows.length > 0 && (

                            <div className="flex items-center">

                                <span className="text-sm text-gray-500 mr-3 whitespace-nowrap">

                                    {selectedRows.length} selected

                                </span>

                                {/* Move */}
                                <button
                                    onClick={handleMoveToPatient}
                                    className="h-11 w-11 border-l border-gray-300 text-black flex items-center justify-center hover:bg-gray-100 transition"
                                >

                                    <MoveRight size={18} />

                                </button>

                                {/* Delete */}
                                <button
                                    onClick={handleDeleteSelected}
                                    className="h-11 w-11 border-l border-gray-300 text-red-600 flex items-center justify-center hover:bg-red-50 transition"
                                >

                                    <Trash2 size={18} />

                                </button>

                            </div>

                        )}

                        {/* Filter */}
                        <div className="relative">

                            <button
                                onClick={() =>
                                    setShowColumnDropdown(
                                        !showColumnDropdown
                                    )
                                }
                                className="h-11 w-11 border-l border-gray-300 text-black flex items-center justify-center"
                            >

                                <FunnelPlus size={18} />

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
                                                className="flex items-center text-black gap-3 text-sm cursor-pointer"
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

            </div>

            {/* Table */}
            <div className="bg-white border overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                {/* Select All */}
                                <th className="p-4 w-12">

                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredLeads.length > 0 &&
                                            selectedRows.length ===
                                            filteredLeads.length
                                        }
                                        onChange={toggleSelectAll}
                                    />

                                </th>

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
                                        colSpan={selectedColumns.length + 1}
                                        className="p-10 text-center text-gray-500"
                                    >

                                        Loading leads...

                                    </td>

                                </tr>

                            ) : filteredLeads.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={selectedColumns.length + 1}
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
                                            router.push(
                                                `/dashboard/lead/edit/${lead.id}`
                                            )
                                        }
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >

                                        {/* Row Checkbox */}
                                        <td
                                            className="p-4"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(lead.id)}
                                                onChange={() =>
                                                    toggleRow(lead.id)
                                                }
                                            />

                                        </td>

                                        {/* Data */}
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
</div>
        </DashboardLayout>
    );
}