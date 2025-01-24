import { NextRequest, NextResponse } from "next/server";
import { Token } from "@/app/models";

export async function GET(req: NextRequest) {
	try {
		const { authority, community } = await req.json();
		const tokens = await Token.find({ authority, community });
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
		const newToken = new Token({
			name,
			symbol,
			description,
			image,
			mint,
			authority,
			community,
		});
		await newToken.save();
		return NextResponse.json({ data: newToken }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
