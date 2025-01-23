import { PrismaClient } from "@prisma/client";

import { UserType } from "./user";
import { CommunityType } from "./community";

export type TokenType = {
	name: string;
	symbol: string;
	description: string;
	image: string;
	mint: string;
	authority: UserType["address"];
	community: CommunityType["name"];
};

export class TokenDBManager {
	static async create(obj: TokenType) {
		const prisma = new PrismaClient();
		try {
			await prisma.token.create({
				data: {
					name: obj.name,
					symbol: obj.symbol,
					description: obj.description,
					image: obj.image,
					mint: obj.mint,
					authority: obj.authority,
					community: obj.community,
				},
			});
			prisma.$disconnect();
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async getAll(manager: string, community: string) {
		const prisma = new PrismaClient();
		try {
			const allTokens = await prisma.token.findMany({
				where: { manager, community },
			});
			prisma.$disconnect();
			return allTokens;
		} catch (error) {
			prisma.$disconnect();
		}
	}

	static async getOne(id: string) {
		const prisma = new PrismaClient();
		try {
			const token = await prisma.token.findUnique({
				where: { id },
			});
			prisma.$disconnect();
			return token;
		} catch (error) {
			prisma.$disconnect();
		}
	}

	// static async update(id: string, updatedData: Partial<TokenType>) {
	// 	const prisma = new PrismaClient();
	// 	try {
	// 		const Tokens = await prisma.Token.findById(id);
	// 		if (updatedData.name !== undefined) {
	// 			this.name = updatedData.name;
	// 		}
	// 		if (updatedData.description !== undefined) {
	// 			this.description = updatedData.description;
	// 		}
	// 		if (updatedData.manager !== undefined) {
	// 			this.manager = updatedData.manager;
	// 		}
	// 		prisma.$disconnect();
	// 	} catch (error) {
	// 		prisma.$disconnect();
	// 	}
	// }
}
