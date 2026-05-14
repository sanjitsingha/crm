"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../DashboardLayout";

import { supabase } from "@/lib/supabase";

import {
    Search,
    Plus,
    Eye,
    Pencil,
    Phone,
    Users,
} from "lucide-react";

export default function patient() {

    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    /* Fetch Patients */
    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients() {

        setLoading(true);

        const { data, error } = await supabase
            .from("patients")
            .select("*")
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.log(error);
            return;
        }

        setPatients(data || []);

        setLoading(false);
    }

    /* Filtered Patients */
    const filteredPatients = useMemo(() => {

        return patients.filter((patient) => {

            const matchesSearch =
                patient.full_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||

                patient.phone_number
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                patient.patient_status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [patients, search, statusFilter]);

    return (
        <DashboardLayout>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">

                        <Users size={28} />

                        Patients

                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage converted and active patients
                    </p>

                </div>

                {/* Add Patient */}
                <button className="h-11 px-5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition">

                    <Plus size={18} />

                    Add Patient

                </button>

            </div>

            {/* Filters */}
            <div className="bg-white border rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-4">

                <div className="flex items-center gap-4 flex-wrap">

                    {/* Search */}
                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="h-11 w-72 rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Under Treatment">
                            Under Treatment
                        </option>

                        <option value="Recovered">
                            Recovered
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>

                </div>

            </div>

            {/* Table */}
            <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Patient
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                                    Patient ID
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

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-gray-500"
                                    >
                                        Loading patients...
                                    </td>
                                </tr>

                            ) : filteredPatients.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-gray-500"
                                    >
                                        No patients found
                                    </td>
                                </tr>

                            ) : (

                                filteredPatients.map((patient) => (

                                    <tr
                                        key={patient.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >

                                        {/* Patient */}
                                        <td className="p-4">

                                            <div>

                                                <p className="font-medium text-gray-800">
                                                    {patient.full_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {patient.email}
                                                </p>

                                            </div>

                                        </td>

                                        {/* Patient UID */}
                                        <td className="p-4 text-gray-600">

                                            {patient.patient_uid || "--"}

                                        </td>

                                        {/* Phone */}
                                        <td className="p-4 text-gray-600">

                                            {patient.phone_number}

                                        </td>

                                        {/* Department */}
                                        <td className="p-4 text-gray-600">

                                            {patient.department}

                                        </td>

                                        {/* Status */}
                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium

                                                ${patient.patient_status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : patient.patient_status === "Under Treatment"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : patient.patient_status === "Recovered"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }
                                                
                                                `}
                                            >

                                                {patient.patient_status}

                                            </span>

                                        </td>

                                        {/* Visit Date */}
                                        <td className="p-4 text-gray-600">

                                            {patient.first_visit_date || "--"}

                                        </td>

                                        {/* Actions */}
                                        <td className="p-4">

                                            <div className="flex items-center gap-2">

                                                {/* View */}
                                                <button className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100">

                                                    <Eye size={16} />

                                                </button>

                                                {/* Edit */}
                                                <button className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100">

                                                    <Pencil size={16} />

                                                </button>

                                                {/* Call */}
                                                <button className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100">

                                                    <Phone size={16} />

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