
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

    console.log("\nFetching lead_tags with join...");
    const { data: joined, error: joinedError } = await supabase
        .from("lead_tags")
        .select(`
            tag_id,
            tags (
                id,
                name,
                color
            )
        `)
        .limit(5);
    
    if (joinedError) {
        console.error("Error fetching joined data:", joinedError);
    } else {
        console.log("Joined data found:", joined.length);
        console.log(JSON.stringify(joined, null, 2));
    }
}

testFetch();
