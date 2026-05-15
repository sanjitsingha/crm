
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hxvjtufmcrtozyfrsovo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmp0dWZtY3J0b3p5ZnJzb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjQwODEsImV4cCI6MjA5NDI0MDA4MX0.MyCRmvA-newc2JqWfKnjPUoa7ASebnpvTYFaAsLtMYk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRelationship() {
    console.log("Checking lead_tags -> tags relationship...");
    const { data, error } = await supabase
        .from("lead_tags")
        .select(`
            *,
            tags (
                id,
                name
            )
        `)
        .limit(1);
    
    if (error) {
        console.error("Relationship error:", error);
    } else {
        console.log("Relationship seems okay (query succeeded).");
        console.log("Data:", data);
    }
}

checkRelationship();
