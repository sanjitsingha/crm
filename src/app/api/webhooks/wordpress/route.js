// app/api/webhooks/wordpress/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {

    try {

        // Incoming webhook data
        const body = await req.json();

        console.log("Webhook Data:", body);

        /**
         * Example incoming data
         * ---------------------
         * {
         *   "name": "John Doe",
         *   "phone": "9876543210",
         *   "email": "john@gmail.com",
         *   "message": "Need appointment"
         * }
         */

        // Extract fields
        const name = body.name || "";
        const phone = body.phone || "";
        const email = body.email || "";
        const notes = body.message || "";

        // Basic validation
        if (!name || !phone) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Name and Phone are required"
                },
                {
                    status: 400
                }
            );
        }

        // Insert into leads table
        const { data, error } = await supabase
            .from("leads")
            .insert([
                {
                    name,
                    phone,
                    email,
                    notes,
                    source: "wordpress",
                    current_status: "New Lead",
                }
            ])
            .select()
            .single();

        // Error handling
        if (error) {

            console.log(error);

            return NextResponse.json(
                {
                    success: false,
                    error: error.message
                },
                {
                    status: 500
                }
            );
        }

        // Success response
        return NextResponse.json({
            success: true,
            message: "Lead Created Successfully",
            lead: data
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}
// app/api/webhooks/wordpress/route.js

export async function GET() {

    return Response.json({
        success: true,
        message: "WordPress Webhook API Running"
    });
}