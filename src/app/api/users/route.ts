import { NextRequest, NextResponse } from "next/server";
import { UserDBManager } from "@/app/managers";

export async function GET(req: NextRequest) {
	const allUsers = await UserDBManager.getAll();
	return NextResponse.json({ data: allUsers }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const { username, address } = await req.json();
	await UserDBManager.create({ username, address });
	return NextResponse.json(
		{ message: "user created successfully" },
		{ status: 201 }
	);
}
