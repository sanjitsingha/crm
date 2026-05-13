"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../DashboardLayout";
import { supabase } from "@/lib/supabase";
import {
    Search,
    Plus,
    Phone,
    Pencil,
    Eye,
    Trash2,
} from "lucide-react";

export default function LeadPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching leads:", error);
                return;
            }

            setLeads(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this lead?")) return;

        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Failed to delete lead");
            return;
        }

        setLeads(leads.filter(lead => lead.id !== id));
    }

    const filteredLeads = leads.filter(lead =>
        lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone_number?.includes(searchTerm) ||
        lead.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {/* Add Lead Button */}
                <Link href="/dashboard/lead/add" className="h-11 px-5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition">

                    <Plus size={18} />

                    Add Lead

                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-2xl p-4 mb-6">

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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-72 rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Status Filter */}
                    <select className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500">

                        <option>All Status</option>
                        <option>New</option>
                        <option>Interested</option>
                        <option>Converted</option>
                        <option>No Response</option>

                    </select>

                    {/* Department Filter */}
                    <select className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500">

                        <option>All Departments</option>
                        <option>Cardiology</option>
                        <option>Diabetes</option>
                        <option>Orthopedics</option>

                    </select>

                    {/* Date Filter */}
                    <input
                        type="date"
                        className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    />

                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Name
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Phone
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Department
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Visit Date
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-500">
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-500">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {lead.full_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {lead.city}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {lead.phone_number}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {lead.interested_department}
                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium
                          ${lead.lead_status === "New"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : lead.lead_status === "Interested"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : lead.lead_status === "Converted"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {lead.lead_status}
                                            </span>

                                        </td>

                                        <td className="p-4 text-gray-600 text-sm">
                                            {lead.preferred_visit_date || "Not set"}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2">

                                                <button className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100 text-gray-600">
                                                    <Eye size={16} />
                                                </button>

                                                <Link href={`/dashboard/lead/edit/${lead.id}`} className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100 text-blue-600">
                                                    <Pencil size={16} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100 text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

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