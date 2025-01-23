import { NextRequest, NextResponse } from "next/server";
import { CommunityDBManager } from "@/app/managers";

export async function GET(req: NextRequest) {
	try {
		const { manager } = await req.json();
		const communities = await CommunityDBManager.getAll(manager);
		return NextResponse.json({ data: communities }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const { name, description, manager } = await req.json();
		if (!name?.trim() || !description?.trim() || !manager?.trim()) {
			return NextResponse.json(
				{ error: "name, description and manager are required" },
				{ status: 400 }
			);
		}
		await CommunityDBManager.create({ name, description, manager });
		return NextResponse.json(
			{ message: "community created successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
