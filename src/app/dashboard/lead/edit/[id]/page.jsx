"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Pencil,
    Save,
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    X,
    Plus,
} from "lucide-react";

import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditLeadPage() {

    const params = useParams();

    const [loading, setLoading] = useState(true);

    const [editingField, setEditingField] = useState(null);

    const [saving, setSaving] = useState(false);

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
        lead_id: "",
    });

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

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {

        try {

            setSaving(true);

            const dataToSubmit = {

                full_name: formData.full_name,

                phone_number: formData.phone_number,

                email: formData.email,

                age:
                    formData.age === "" || formData.age === null
                        ? null
                        : parseInt(formData.age),

                gender: formData.gender,

                city: formData.city,

                interested_department: formData.interested_department,

                campaign_name: formData.campaign_name,

                ad_set: formData.ad_set,

                ad_creative: formData.ad_creative,

                source: formData.source,

                medical_concern: formData.medical_concern,

                preferred_visit_date: formData.preferred_visit_date,

                priority: formData.priority,

                lead_status: formData.lead_status,

                notes: formData.notes,
            };

            const { error } = await supabase
                .from("leads")
                .update(dataToSubmit)
                .eq("id", params.id);

            if (error) {

                console.log(error);

                alert(error.message);

                return;
            }

            alert("Lead updated successfully");

        } catch (error) {

            console.log(error);

        } finally {

            setSaving(false);
        }
    }

    if (loading) {

        return (

            <DashboardLayout>

                <div className="h-[60vh] flex items-center justify-center text-gray-500">

                    Loading lead...

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            {/* TOP HEADER */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-6">

                <div className="flex items-start justify-between">

                    <div>

                        <Link
                            href="/dashboard/lead"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4"
                        >

                            <ArrowLeft size={16} />

                            Back to Leads

                        </Link>

                        <h1 className="text-3xl font-bold text-black">

                            {formData.full_name || "Unnamed Lead"}

                        </h1>

                        <div className="mt-4">

                            <LeadTags leadId={params.id} />

                        </div>

                        <div className="flex items-center gap-3 mt-3 flex-wrap">

                            <span className="text-sm text-gray-500">

                                {formData.lead_id}

                            </span>

                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">

                                {formData.lead_status}

                            </span>

                            {formData.phone_number && (

                                <div className="flex items-center gap-1 text-sm text-gray-600">

                                    <Phone size={14} />

                                    {formData.phone_number}

                                </div>

                            )}

                            {formData.email && (

                                <div className="flex items-center gap-1 text-sm text-gray-600">

                                    <Mail size={14} />

                                    {formData.email}

                                </div>

                            )}

                            {formData.city && (

                                <div className="flex items-center gap-1 text-sm text-gray-600">

                                    <MapPin size={14} />

                                    {formData.city}

                                </div>

                            )}

                        </div>

                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="h-11 px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    >

                        <Save size={18} />

                        {saving ? "Saving..." : "Save Changes"}

                    </button>

                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="space-y-6">

                {/* BASIC INFO */}
                <Section title="Basic Information">

                    <EditableField
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        options={[
                            "Male",
                            "Female",
                            "Other",
                        ]}
                    />

                    <EditableField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                </Section>

                {/* LEAD INFO */}
                <Section title="Lead Information">

                    <EditableField
                        label="Department"
                        name="interested_department"
                        value={formData.interested_department}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        options={[
                            "Cardiology",
                            "Diabetes",
                            "Orthopedics",
                        ]}
                    />

                    <EditableField
                        label="Campaign Name"
                        name="campaign_name"
                        value={formData.campaign_name}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Ad Set"
                        name="ad_set"
                        value={formData.ad_set}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Ad Creative"
                        name="ad_creative"
                        value={formData.ad_creative}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Lead Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        options={[
                            "Facebook",
                            "Instagram",
                            "Website",
                            "Walk-in",
                        ]}
                    />

                    <EditableField
                        label="Priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        options={[
                            "High",
                            "Medium",
                            "Low",
                        ]}
                    />

                </Section>

                {/* MEDICAL INFO */}
                <Section title="Medical Information">

                    <EditableField
                        label="Medical Concern"
                        name="medical_concern"
                        value={formData.medical_concern}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Preferred Visit Date"
                        name="preferred_visit_date"
                        type="date"
                        value={formData.preferred_visit_date}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />

                    <EditableField
                        label="Lead Status"
                        name="lead_status"
                        value={formData.lead_status}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        options={[
                            "New",
                            "Interested",
                            "Converted",
                            "No Response",
                        ]}
                    />

                </Section>

                {/* NOTES */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm">

                    <div className="p-6 border-b">

                        <h2 className="text-lg font-semibold text-black">

                            Notes

                        </h2>

                    </div>

                    <div className="p-6">

                        <textarea
                            rows={6}
                            name="notes"
                            value={formData.notes || ""}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-blue-500 text-black"
                            placeholder="Write notes..."
                        />

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

/* SECTION */
function Section({ title, children }) {

    return (

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b">

                <h2 className="text-lg font-semibold text-black">

                    {title}

                </h2>

            </div>

            <div className="p-6 grid grid-cols-2 gap-6">

                {children}

            </div>

        </div>
    );
}

/* EDITABLE FIELD */
function EditableField({
    label,
    name,
    value,
    onChange,
    editingField,
    setEditingField,
    type = "text",
    options = [],
}) {

    const isEditing = editingField === name;

    return (

        <div className="group">

            <div className="flex items-center justify-between mb-2">

                <label className="text-sm font-medium text-gray-500">

                    {label}

                </label>

                <button
                    type="button"
                    onClick={() => setEditingField(name)}
                    className="opacity-0 group-hover:opacity-100 transition"
                >

                    <Pencil
                        size={16}
                        className="text-gray-400 hover:text-blue-600"
                    />

                </button>

            </div>

            {isEditing ? (

                options.length > 0 ? (

                    <select
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="h-11 w-full rounded-xl border border-blue-500 px-4 outline-none text-black"
                    >

                        {options.map((option) => (

                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>

                        ))}

                    </select>

                ) : (

                    <input
                        type={type}
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="h-11 w-full rounded-xl border border-blue-500 px-4 outline-none text-black"
                    />

                )

            ) : (

                <div className="min-h-[44px] flex items-center px-1 text-black font-medium">

                    {value || "-"}

                </div>

            )}

        </div>
    );
}

/* TAG COMPONENT */
function LeadTags({ leadId }) {

    const [tags, setTags] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);

    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {

        fetchTags();

        fetchLeadTags();

    }, []);

    async function fetchTags() {
        console.log("Fetching all tags...");
        const { data, error } = await supabase
            .from("tags")
            .select("*");

        if (error) {
            console.error("Error fetching tags:", error);
            return;
        }

        console.log("Tags fetched:", data);
        if (data) {
            setTags(data);
        }
    }

    async function fetchLeadTags() {
        console.log("Fetching tags for lead:", leadId);
        const { data, error } = await supabase
            .from("lead_tags")
            .select(`
                tag_id,
                tags (
                    id,
                    name,
                    color
                )
            `)
            .eq("lead_id", leadId);

        if (error) {
            console.error("Error fetching lead tags:", error);
            return;
        }

        console.log("Lead tags fetched:", data);
        if (data) {
            const formatted = data
                .filter(item => item.tags) // Ensure tags exist
                .map((item) => item.tags);
            setSelectedTags(formatted);
        }
    }

    async function addTag(tag) {

        const alreadyExists = selectedTags.find(
            (t) => t.id === tag.id
        );

        if (alreadyExists) return;

        const { error } = await supabase
            .from("lead_tags")
            .insert({
                lead_id: leadId,
                tag_id: tag.id,
            });

        if (!error) {

            setSelectedTags([...selectedTags, tag]);
        }
    }

    async function removeTag(tagId) {

        await supabase
            .from("lead_tags")
            .delete()
            .eq("lead_id", leadId)
            .eq("tag_id", tagId);

        setSelectedTags(
            selectedTags.filter((tag) => tag.id !== tagId)
        );
    }

    return (

        <div className="relative">

            <div className="flex items-center gap-2 flex-wrap">

                {selectedTags.map((tag) => (

                    <div
                        key={tag.id}
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{
                            backgroundColor: tag.color || "#2563eb",
                        }}
                    >

                        {tag.name}

                        <button
                            onClick={() => removeTag(tag.id)}
                            className="hover:opacity-70"
                        >

                            <X size={14} />

                        </button>

                    </div>

                ))}

                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-8 px-3 rounded-full border border-dashed border-gray-300 text-sm flex items-center gap-1 hover:border-blue-500 hover:text-blue-600"
                >

                    <Plus size={14} />

                    Add Tag

                </button>

            </div>

            {showDropdown && (

                <div className="absolute z-50 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-2">

                    <div className="max-h-60 overflow-y-auto">

                        {tags.map((tag) => {

                            const active = selectedTags.find(
                                (t) => t.id === tag.id
                            );

                            return (

                                <button
                                    key={tag.id}
                                    disabled={active}
                                    onClick={() => addTag(tag)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition
                                    
                                    ${active
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-50 text-black"
                                        }
                                    
                                    `}
                                >

                                    <div className="flex items-center gap-2">

                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    tag.color || "#2563eb",
                                            }}
                                        />

                                        {tag.name}

                                    </div>

                                    {active && "Added"}

                                </button>
                            );
                        })}

                    </div>

                </div>

            )}

        </div>
    );
}