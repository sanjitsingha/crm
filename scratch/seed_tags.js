
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hxvjtufmcrtozyfrsovo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmp0dWZtY3J0b3p5ZnJzb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjQwODEsImV4cCI6MjA5NDI0MDA4MX0.MyCRmvA-newc2JqWfKnjPUoa7ASebnpvTYFaAsLtMYk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultTags = [
    { name: "Hot Lead", color: "#ef4444" },
    { name: "Warm Lead", color: "#f97316" },
    { name: "Cold Lead", color: "#3b82f6" },
    { name: "Follow-up", color: "#8b5cf6" },
    { name: "Priority", color: "#ec4899" },
];

async function seedTags() {
    console.log("Seeding default tags...");
    const { data, error } = await supabase.from("tags").insert(defaultTags).select();
    if (error) {
        console.error("Error seeding tags:", error);
    } else {
        console.log("Successfully seeded tags:", data);
    }
}

seedTags();
