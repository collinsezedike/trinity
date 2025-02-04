import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/models";
import { connectDB, ContextParamsType } from "@/lib/utils";

export async function GET(req: NextRequest, context: ContextParamsType) {
	try {
		await connectDB();
		// In the case of a user, the id is the wallet address
		const { id } = await context.params;
		const user = await User.findOne({ address: id });
		if (!user) {
			return NextResponse.json(
				{ error: "invalid wallet address" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ data: user }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest, context: ContextParamsType) {
	try {
		await connectDB();
		const { username } = await req.json();
		// In the case of a user, the id is the wallet address
		const { id } = await context.params;
		const user = await User.findOne({ address: id });
		if (!user) {
			return NextResponse.json(
				{ error: "invalid wallet address" },
				{ status: 400 }
			);
		}
		user.username = username ? username : user.username;
		await user.save();

		return NextResponse.json({ data: user }, { status: 201 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		);
	}
}
