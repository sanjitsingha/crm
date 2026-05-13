"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { leads } from "@/data/leads";
export default function EditLeadPage() {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        email: "",
        age: "",
        gender: "",
        city: "",
        interested_department: "",
        campaign_name: "",
        ad_set: "",
        ad_creative: "",
        source: "",
        medical_concern: "",
        preferred_visit_date: "",
        priority: "Medium",
        lead_status: "New",
        notes: "",
    });

    /* Fetch Lead */
    useEffect(() => {
        fetchLead();
    }, []);

    async function fetchLead() {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            console.log(error);
            return;
        }

        setFormData(data);
        setLoading(false);
    }

    /* Handle Change */
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    /* Update Lead */
    async function handleSubmit(e) {
        e.preventDefault();

        // Clean data: convert empty strings for numeric fields to null
        const dataToSubmit = {
            ...formData,
            age: formData.age === "" || formData.age === null ? null : parseInt(formData.age),
            preferred_visit_date: formData.preferred_visit_date === "" ? null : formData.preferred_visit_date,
        };

        const { error } = await supabase
            .from("leads")
            .update(dataToSubmit)
            .eq("id", params.id);

        if (error) {
            console.log(error);
            alert("Failed to update lead: " + error.message);
            return;
        }

        alert("Lead updated successfully");

        router.push("/dashboard/leads");
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div>Loading...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Edit Lead
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Update lead information
                </p>

            </div>

            {/* Form */}
            <div className="bg-white border rounded-2xl p-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-10"
                >

                    {/* Basic Information */}
                    <div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-2 gap-5">

                            <Input
                                label="Full Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />

                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <Input
                                label="Age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                            />

                            <Select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    "Male",
                                    "Female",
                                    "Other",
                                ]}
                            />

                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    {/* Lead Information */}
                    <div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Lead Information
                        </h2>

                        <div className="grid grid-cols-2 gap-5">

                            <Input
                                label="Campaign Name"
                                name="campaign_name"
                                value={formData.campaign_name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Ad Set"
                                name="ad_set"
                                value={formData.ad_set}
                                onChange={handleChange}
                            />

                            <Input
                                label="Ad Creative"
                                name="ad_creative"
                                value={formData.ad_creative}
                                onChange={handleChange}
                            />

                            <Select
                                label="Lead Source"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                options={[
                                    "Facebook",
                                    "Instagram",
                                    "Website",
                                    "Walk-in",
                                ]}
                            />

                            <Select
                                label="Department"
                                name="interested_department"
                                value={formData.interested_department}
                                onChange={handleChange}
                                options={[
                                    "Cardiology",
                                    "Diabetes",
                                    "Orthopedics",
                                ]}
                            />

                            <Select
                                label="Priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                options={[
                                    "High",
                                    "Medium",
                                    "Low",
                                ]}
                            />

                        </div>

                    </div>

                    {/* Medical Info */}
                    <div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Medical Information
                        </h2>

                        <div className="grid grid-cols-2 gap-5">

                            <Input
                                label="Medical Concern"
                                name="medical_concern"
                                value={formData.medical_concern}
                                onChange={handleChange}
                            />

                            <Input
                                label="Preferred Visit Date"
                                type="date"
                                name="preferred_visit_date"
                                value={formData.preferred_visit_date}
                                onChange={handleChange}
                            />

                            <Select
                                label="Lead Status"
                                name="lead_status"
                                value={formData.lead_status}
                                onChange={handleChange}
                                options={[
                                    "New",
                                    "Interested",
                                    "Converted",
                                    "No Response",
                                ]}
                            />

                        </div>

                    </div>

                    {/* Notes */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>

                        <textarea
                            rows={5}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t">

                        <button
                            type="button"
                            className="h-11 px-6 rounded-xl border hover:bg-gray-100"
                            onClick={() =>
                                router.push("/dashboard/leads")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="h-11 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Update Lead
                        </button>

                    </div>

                </form>

            </div>

        </DashboardLayout>
    );
}

/* Input Component */
function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
}) {
    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
            />

        </div>
    );
}

/* Select Component */
function Select({
    label,
    name,
    value,
    onChange,
    options,
}) {
    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
            >

                <option value="">
                    Select option
                </option>

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}

            </select>

        </div>
    );
}