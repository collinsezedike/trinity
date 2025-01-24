import { NextRequest, NextResponse } from "next/server";

import { connectDB, ContextParamsType } from "@/lib/utils";
import { Token } from "@/app/models";

export async function GET(req: NextRequest, context: ContextParamsType) {
	try {
		await connectDB();
		const token = await Token.findById(context.params.id);
		if (!token) {
			return NextResponse.json(
				{ error: "invalid token id" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ data: token }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// export async function PUT(req: NextRequest, context: ContextParamsType) {
// 	try {
// 		const { Tokenname } = await req.json();
// 		await TokenDBManager.update(context.params.id, Tokenname);
// 		return NextResponse.json(
// 			{ message: "Token created successfully" },
// 			{ status: 201 }
// 		);
// 	} catch (error) {
// 		return NextResponse.json({ error }, { status: 500 });
// 	}
// }
