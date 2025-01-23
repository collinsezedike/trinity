import { NextRequest, NextResponse } from "next/server";
import { UserDBManager } from "@/app/managers";
import { ContextParamsType } from "@/lib/utils";

export async function GET(req: NextRequest, context: ContextParamsType) {
	try {
		// In the case of a user, the id is the wallet address
		const user = await UserDBManager.getOne(context.params.id);
		return NextResponse.json({ data: user }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, context: ContextParamsType) {
	try {
		const { username } = await req.json();
		await UserDBManager.update(context.params.id, username);
		return NextResponse.json(
			{ message: "user created successfully" },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
