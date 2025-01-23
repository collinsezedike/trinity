import { NextRequest, NextResponse } from "next/server";
import { TokenDBManager } from "@/app/managers";

export async function GET(req: NextRequest) {
	try {
		const { authority, community } = await req.json();
		const tokens = await TokenDBManager.getAll(authority, community);
		return NextResponse.json({ data: tokens }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const { name, symbol, description, image, mint, authority, community } =
			await req.json();
		if (
			!name?.trim() ||
			!symbol?.trim() ||
			!description?.trim() ||
			!image?.trim() ||
			!mint?.trim() ||
			!authority?.trim() ||
			!community?.trim()
		) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}
		await TokenDBManager.create({
			name,
			symbol,
			description,
			image,
			mint,
			authority,
			community,
		});
		return NextResponse.json(
			{ message: "token created successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
