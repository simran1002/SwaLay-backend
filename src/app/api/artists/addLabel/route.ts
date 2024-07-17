// Assuming this is in your Next.js API route file, e.g., src/app/api/labels.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Label, { ILabel } from "@/models/label";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    await connect(); // Ensure database connection

    try {
        const reqBody = await request.json();
        const { artistName, iprs, iprsNumber, facebook, appleMusic, spotify, instagramUsername, profileImage } = reqBody;

        // Validate and create a new Label document
        const newLabel: ILabel = new Label({
            artistName,
            iprs,
            iprsNumber,
            facebook,
            appleMusic,
            spotify,
            instagramUsername,
            profileImage
        });

        // Save the new label to the database
        await newLabel.save();

        return NextResponse.json({
            message: "Label created successfully",
            data: newLabel,
            success: true,
            status: 200
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
}
