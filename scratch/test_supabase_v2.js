
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hxvjtufmcrtozyfrsovo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmp0dWZtY3J0b3p5ZnJzb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjQwODEsImV4cCI6MjA5NDI0MDA4MX0.MyCRmvA-newc2JqWfKnjPUoa7ASebnpvTYFaAsLtMYk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
    console.log("Fetching tags...");
    const { data: tags, error: tagsError } = await supabase.from("tags").select("*");
    if (tagsError) {
        console.error("Error fetching tags:", tagsError);
    } else {
        console.log("Tags found:", tags.length);
        console.log(tags);
    }

    console.log("\nFetching lead_tags...");
    const { data: leadTags, error: leadTagsError } = await supabase.from("lead_tags").select("*").limit(5);
    if (leadTagsError) {
        console.error("Error fetching lead_tags:", leadTagsError);
    } else {
        console.log("Lead Tags found:", leadTags.length);
        console.log(leadTags);
    }
}

testFetch();
