import { NextRequest, NextResponse } from "next/server";

import { Community } from "@/app/models";
import { connectDB } from "@/lib/utils";

export async function GET(req: NextRequest) {
	try {
		await connectDB();
		const { manager } = await req.json();
		if (!manager?.trim()) {
			return NextResponse.json(
				{ error: "manager is required" },
				{ status: 400 }
			);
		}
		const communities = await Community.find({ manager });
		return NextResponse.json({ data: communities }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const { name, description, manager } = await req.json();
		if (!name?.trim() || !description?.trim() || !manager?.trim()) {
			return NextResponse.json(
				{ error: "name, description and manager are required" },
				{ status: 400 }
			);
		}
		const newCommunity = new Community({ name, description, manager });
		await newCommunity.save();
		return NextResponse.json({ data: newCommunity }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
