"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "../../DashboardLayout";

export default function add() {
    const [loading, setLoading] = useState(false);

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
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            // Clean data: convert empty strings for numeric fields to null
            const dataToSubmit = {
                ...formData,
                age: formData.age === "" ? null : parseInt(formData.age),
                preferred_visit_date: formData.preferred_visit_date === "" ? null : formData.preferred_visit_date,
            };

            const { error } = await supabase
                .from("leads")
                .insert([dataToSubmit]);

            if (error) {
                console.log(error);
                alert("Failed to add lead: " + error.message);
                return;
            }

            alert("Lead added successfully");

            setFormData({
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

        } catch (error) {
            console.log(error);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }
    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Add New Lead
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Create and manage healthcare lead information
                </p>
            </div>

            <div className="bg-white border rounded-2xl p-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-10">

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
                                placeholder="Enter full name"
                                required
                            />

                            <Input
                                label="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />

                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />

                            <Input
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                type="number"
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
                                placeholder="Enter city"
                            />

                        </div>

                    </div>

                    {/* Lead Information */}
                    <div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Lead Information
                        </h2>

                        <div className="grid grid-cols-2 gap-5">

                            <Select
                                label="Interested Department"
                                name="interested_department"
                                value={formData.interested_department}
                                onChange={handleChange}
                                options={[
                                    "Cardiology",
                                    "Diabetes",
                                    "Orthopedics",
                                    "Neurology",
                                    "Gynecology",
                                ]}
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
                                    "Referral",
                                ]}
                            />

                            <Input
                                label="Campaign Name"
                                name="campaign_name"
                                value={formData.campaign_name}
                                onChange={handleChange}
                                placeholder="Enter campaign name"
                            />

                            <Input
                                label="Ad Set"
                                name="ad_set"
                                value={formData.ad_set}
                                onChange={handleChange}
                                placeholder="Enter ad set"
                            />

                            <Input
                                label="Ad Creative"
                                name="ad_creative"
                                value={formData.ad_creative}
                                onChange={handleChange}
                                placeholder="Enter ad creative"
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

                    {/* Medical Information */}
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
                                placeholder="Describe medical concern"
                            />

                            <Input
                                label="Preferred Visit Date"
                                name="preferred_visit_date"
                                value={formData.preferred_visit_date}
                                onChange={handleChange}
                                type="date"
                            />

                            <Select
                                label="Lead Status"
                                name="lead_status"
                                value={formData.lead_status}
                                onChange={handleChange}
                                options={[
                                    "New",
                                    "Contacted",
                                    "Interested",
                                    "Converted",
                                    "No Response",
                                ]}
                            />

                        </div>

                    </div>

                    {/* Notes */}
                    <div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Additional Notes
                        </h2>

                        <textarea
                            rows={5}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Write additional notes..."
                            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t">

                        <button
                            type="button"
                            className="h-11 px-6 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button

                            type="submit"
                            disabled={loading}
                            className={`h-11 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Saving..." : "Save Lead"}
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
    placeholder,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                required={required}
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
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
            >

                <option value="">Select option</option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}

            </select>
        </div>
    );
}