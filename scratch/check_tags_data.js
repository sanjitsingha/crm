
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hxvjtufmcrtozyfrsovo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmp0dWZtY3J0b3p5ZnJzb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjQwODEsImV4cCI6MjA5NDI0MDA4MX0.MyCRmvA-newc2JqWfKnjPUoa7ASebnpvTYFaAsLtMYk";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    realtime: { enabled: false }
});

async function checkTable() {
    console.log("Checking 'tags' table...");
    const { data, error, count } = await supabase
        .from("tags")
        .select("*", { count: 'exact' });

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success! Data length:", data.length);
        console.log("Total count from DB:", count);
        console.log("Data sample:", data.slice(0, 5));
    }
}

checkTable();
