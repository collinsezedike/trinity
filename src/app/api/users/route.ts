import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models";

export async function GET(req: NextRequest) {
	const allUsers = await User.find();
	return NextResponse.json({ data: allUsers }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const { username, address } = await req.json();
	const newUser = new User({ username, address });
	return NextResponse.json({ data: newUser }, { status: 201 });
}
