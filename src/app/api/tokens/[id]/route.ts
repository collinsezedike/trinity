import { NextRequest, NextResponse } from "next/server";

import { ContextParamsType } from "@/lib/utils";
import { Token } from "@/app/models";

export async function GET(req: NextRequest, context: ContextParamsType) {
	try {
		const token = await Token.findById(context.params.id);
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
