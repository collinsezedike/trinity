import { PrismaClient } from "@prisma/client";

import { UserType } from "./user";

export type CommunityType = {
	name: string;
	description: string;
	manager: UserType;
};

export class CommunityDBManager {
	static async create(obj: CommunityType) {
		const prisma = new PrismaClient();
		try {
			await prisma.community.create({
				data: {
					name: obj.name,
					description: obj.description,
					manager: obj.manager,
				},
			});
			prisma.$disconnect();
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async getAll(manager: string) {
		const prisma = new PrismaClient();
		try {
			const allCommunities = await prisma.community.findMany({
				where: { manager },
			});
			prisma.$disconnect();
			return allCommunities;
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async getOne(id: string) {
		const prisma = new PrismaClient();
		try {
			const community = await prisma.community.findUnique({
				where: { id },
			});
			prisma.$disconnect();
			return community;
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	// static async update(id: string, updatedData: Partial<CommunityType>) {
	// 	const prisma = new PrismaClient();
	// 	try {
	// 		const communitys = await prisma.community.findById(id);
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
