"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Pencil,
  Save,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  X,
  Plus,
  Search,
  Check,
  Tag as TagIcon,
  Users,
} from "lucide-react";

import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditLeadPage() {
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [editingField, setEditingField] = useState(null);

  const [saving, setSaving] = useState(false);

  const [followUps, setFollowUps] = useState([]);

  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const router = useRouter();

  const [followUpForm, setFollowUpForm] = useState({
    call_status: "Connected",
    lead_response: "Interested",
    next_follow_up: "",
    notes: "",
  });

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

  async function fetchFollowUps(leadId) {
    const { data, error } = await supabase
      .from("follow_up_calls")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setFollowUps(data || []);
  }

  async function saveFollowUp() {
    try {
      setSavingFollowUp(true);

      const { error } = await supabase.from("follow_up_calls").insert([
        {
          lead_id: params.id,
          call_status: followUpForm.call_status,
          lead_response: followUpForm.lead_response,
          next_follow_up: followUpForm.next_follow_up || null,
          notes: followUpForm.notes,
        },
      ]);

      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }

      setFollowUpForm({
        call_status: "Connected",
        lead_response: "Interested",
        next_follow_up: "",
        notes: "",
      });

      await fetchFollowUps(params.id);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingFollowUp(false);
    }
  }

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

    await fetchFollowUps(data.id);

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

  async function handleConvert() {
    try {
      setConverting(true);

      // 1. Insert into patients table
      const { error: patientError } = await supabase.from("patients").insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          department: formData.interested_department,
          patient_status: "Active",
          first_visit_date: formData.preferred_visit_date,
        },
      ]);

      if (patientError) {
        console.error(patientError);
        alert("Error creating patient: " + patientError.message);
        return;
      }

      // 2. Update lead status to Converted
      const { error: leadError } = await supabase
        .from("leads")
        .update({ lead_status: "Converted" })
        .eq("id", params.id);

      if (leadError) {
        console.error(leadError);
        alert("Error updating lead status: " + leadError.message);
        return;
      }

      alert("Lead converted to patient successfully!");
      router.push("/dashboard/patient");
    } catch (error) {
      console.error(error);
    } finally {
      setConverting(false);
      setShowConvertModal(false);
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
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
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
              <span className="text-sm text-gray-500">{formData.lead_id}</span>

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
            onClick={() => setShowConvertModal(true)}
            className="h-11 px-5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <Users size={18} />
            Convert to Patient
          </button>
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
        <Section   title="Basic Information">
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
            options={["Male", "Female", "Other"]}
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
            options={["Cardiology", "Diabetes", "Orthopedics"]}
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
            options={["Facebook", "Instagram", "Website", "Walk-in"]}
          />

          <EditableField
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            editingField={editingField}
            setEditingField={setEditingField}
            options={["High", "Medium", "Low"]}
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
            options={["New", "Interested", "Converted", "No Response"]}
          />
        </Section>

        {/* NOTES */}
        <div className="bg-white  border border-gray-200 shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-black">Notes</h2>
          </div>

          <div className="p-6">
            <textarea
              rows={6}
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              className="w-full  border border-gray-200 p-4 outline-none focus:border-blue-500 text-black"
              placeholder="Write notes..."
            />
          </div>
        </div>
        {/* FOLLOW UP CALLS */}
        <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black">
                Follow Up Calls
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Track all follow up communication history
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              {followUps.length} Records
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Current Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[350px]">
                    Notes
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Next Follow Up
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Call Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* EXISTING ROWS */}
                {followUps.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* DATE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(item.call_date).toLocaleDateString()}
                    </td>

                    {/* CURRENT STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                      item.lead_response === "Interested"
                                        ? "bg-green-100 text-green-700"
                                        : item.lead_response ===
                                            "Not Interested"
                                          ? "bg-red-100 text-red-700"
                                          : item.lead_response ===
                                              "Callback Later"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-blue-100 text-blue-700"
                                    }
                                `}
                      >
                        {item.lead_response}
                      </span>
                    </td>

                    {/* NOTES */}
                    <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                      {item.notes || "-"}
                    </td>

                    {/* NEXT FOLLOW UP */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.next_follow_up
                        ? new Date(item.next_follow_up).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* CALL STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                      item.call_status === "Connected"
                                        ? "bg-blue-100 text-blue-700"
                                        : item.call_status === "No Answer"
                                          ? "bg-gray-200 text-gray-700"
                                          : item.call_status === "Busy"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : item.call_status ===
                                                "Wrong Number"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-gray-100 text-gray-700"
                                    }
                                `}
                      >
                        {item.call_status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {/* INLINE ADD ROW */}
                <tr className="bg-blue-50/40 border-t-2 border-blue-100">
                  {/* DATE */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString()}
                  </td>

                  {/* CURRENT STATUS */}
                  <td className="px-6 py-4">
                    <select
                      value={followUpForm.lead_response}
                      onChange={(e) =>
                        setFollowUpForm({
                          ...followUpForm,
                          lead_response: e.target.value,
                        })
                      }
                      className="h-10 w-full text-black border border-gray-200 px-3 outline-none focus:border-blue-500 text-sm bg-white"
                    >
                      <option>Interested</option>
                      <option>Not Interested</option>
                      <option>Callback Later</option>
                      <option>Converted</option>
                    </select>
                  </td>

                  {/* NOTES */}
                  <td className="px-6 py-4">
                    <textarea
                      type="text"
                      placeholder="Write notes..."
                      value={followUpForm.notes}
                      onChange={(e) =>
                        setFollowUpForm({
                          ...followUpForm,
                          notes: e.target.value,
                        })
                      }
                      className="h-10 w-full p-2 border text-black border-gray-200 px-4 outline-none focus:border-blue-500 text-sm bg-white"
                    />
                  </td>

                  {/* NEXT FOLLOW UP */}
                  <td className="px-6 py-4">
                    <input
                      type="date"
                      value={followUpForm.next_follow_up}
                      onChange={(e) =>
                        setFollowUpForm({
                          ...followUpForm,
                          next_follow_up: e.target.value,
                        })
                      }
                      className="h-10 w-full text-black border border-gray-200 px-3 outline-none focus:border-blue-500 text-sm bg-white"
                    />
                  </td>

                  {/* CALL STATUS */}
                  <td className="px-6 py-4">
                    <select
                      value={followUpForm.call_status}
                      onChange={(e) =>
                        setFollowUpForm({
                          ...followUpForm,
                          call_status: e.target.value,
                        })
                      }
                      className="h-10 w-full text-black border border-gray-200 px-3 outline-none focus:border-blue-500 text-sm bg-white"
                    >
                      <option>Connected</option>
                      <option>No Answer</option>
                      <option>Busy</option>
                      <option>Switched Off</option>
                      <option>Wrong Number</option>
                    </select>
                  </td>

                  {/* SAVE */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={saveFollowUp}
                      disabled={savingFollowUp}
                      className="h-10 px-5 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
                    >
                      {savingFollowUp ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

     

      {/* CONVERT MODAL */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Convert to Patient?
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              This will move{" "}
              <span className="font-bold text-gray-900">
                {formData.full_name}
              </span>{" "}
              from leads to the patients list and update their status to
              "Converted". This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConvert}
                disabled={converting}
                className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {converting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* SECTION */
function Section({ title, children }) {
  return (
    <div className="bg-white  border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>

      <div className="p-6 grid grid-cols-2 gap-3">{children}</div>
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
        <label className="text-sm font-medium text-gray-500">{label}</label>

        <button
          type="button"
          onClick={() => setEditingField(name)}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <Pencil size={16} className="text-gray-400 hover:text-blue-600" />
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
              <option key={option} value={option}>
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (leadId) {
      Promise.all([fetchTags(), fetchLeadTags()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [leadId]);

  async function fetchTags() {
    const { data, error } = await supabase.from("tags").select("*");

    if (error) {
      console.error("Error fetching tags:", error);
      return;
    }

    console.log("DEBUG: tags table query result:", data);
    if (data && data.length === 0) {
      console.warn("DEBUG: tags table is empty or RLS is blocking SELECT.");
    }

    if (data) {
      setTags(data);
    }
  }

  async function fetchLeadTags() {
    const { data, error } = await supabase
      .from("lead_tags")
      .select(
        `
                tag_id,
                tags (
                    id,
                    name,
                    color
                )
            `,
      )
      .eq("lead_id", leadId);

    if (error) {
      console.error("Error fetching lead tags:", error);
      return;
    }

    console.log("Lead tags fetched:", data);
    if (data) {
      const formatted = data
        .filter((item) => item.tags) // Ensure tags exist
        .map((item) => item.tags);
      setSelectedTags(formatted);
    }
  }

  async function addTag(tag) {
    const alreadyExists = selectedTags.find((t) => t.id === tag.id);

    if (alreadyExists) return;

    const { error } = await supabase.from("lead_tags").insert({
      lead_id: leadId,
      tag_id: tag.id,
    });

    if (!error) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  async function removeTag(tagId) {
    try {
      const { error } = await supabase
        .from("lead_tags")
        .delete()
        .eq("lead_id", leadId)
        .eq("tag_id", tagId);

      if (error) throw error;

      setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error("Error removing tag:", error);
    }
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
        <div className="absolute z-50 mt-3 w-72 bg-white border border-gray-200  shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Search & Create Header */}
          <div className="p-3 border-b bg-gray-50/50">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm border border-gray-200 text-black pl-8 pr-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
          </div>

          {/* Tags List */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  Fetching tags...
                </p>
              </div>
            ) : tags.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TagIcon size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-900 font-semibold mb-1">
                  No tags available
                </p>
                <p className="text-xs text-gray-500 px-4">
                  Add tags in the Tags management section.
                </p>
              </div>
            ) : (
              <div className="p-1">
                {tags
                  .filter((t) =>
                    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((tag) => {
                    const isSelected = selectedTags.find(
                      (t) => t.id === tag.id,
                    );

                    return (
                      <button
                        key={tag.id}
                        onClick={() =>
                          isSelected ? removeTag(tag.id) : addTag(tag)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition group
                                                    ${
                                                      isSelected
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "hover:bg-gray-50 text-gray-700"
                                                    }
                                                `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
                            style={{
                              backgroundColor: tag.color || "#2563eb",
                            }}
                          />
                          <span className="font-medium">{tag.name}</span>
                        </div>
                        {isSelected ? (
                          <Check size={16} className="text-blue-600" />
                        ) : (
                          <Plus
                            size={16}
                            className="text-gray-300 opacity-0 group-hover:opacity-100 transition"
                          />
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-gray-50 border-t">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              {tags.length} Total Tags Available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
