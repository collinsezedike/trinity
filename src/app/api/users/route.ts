import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/models";
import { connectDB } from "@/lib/utils";

export async function GET(req: NextRequest) {
	try {
		await connectDB();
		const allUsers = await User.find();
		return NextResponse.json({ data: allUsers }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const { username, address } = await req.json();
		if (!username?.trim() || !address?.trim()) {
			return NextResponse.json(
				{ error: "username and address are required" },
				{ status: 400 }
			);
		}
		const newUser = new User({ username, address });
		return NextResponse.json({ data: newUser }, { status: 201 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		);
	}
}
