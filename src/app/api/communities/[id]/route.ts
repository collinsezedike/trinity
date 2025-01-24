import { NextRequest, NextResponse } from "next/server";

import { ContextParamsType } from "@/lib/utils";
import { Community } from "@/app/models";

export async function GET(req: NextRequest, context: ContextParamsType) {
	try {
		const community = await Community.findById(context.params.id);
		return NextResponse.json({ data: community }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// export async function PUT(req: NextRequest, context: ContextParamsType) {
//     try {
//         // const { data } = await req.json();
//         await CommunityDBManager.update(context.params.id, await req.json());
//         return NextResponse.json(
//             { message: "Community created successfully" },
//             { status: 201 }
//         );
//     } catch (error) {
//         return NextResponse.json({ error }, { status: 500 });
//     }
// }
