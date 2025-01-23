import { PrismaClient } from "@prisma/client";

export type UserType = {
	address: string;
	username: string;
};

export class UserDBManager {
	static async create(obj: UserType) {
		const prisma = new PrismaClient();
		try {
			await prisma.user.create({
				data: {
					username: obj.username,
					address: obj.address,
				},
			});
			prisma.$disconnect();
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async getAll() {
		const prisma = new PrismaClient();
		try {
			const allUsers = await prisma.user.findMany({});
			prisma.$disconnect();
			return allUsers;
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async getOne(id: string) {
		const prisma = new PrismaClient();
		try {
			const user = await prisma.user.findUnique({ where: { id } });
			prisma.$disconnect();
			return user;
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}

	static async update(id: string, username: string) {
		const prisma = new PrismaClient();
		try {
			if (username) {
				await prisma.user.update({
					where: { id },
					data: { username },
				});
			}
			prisma.$disconnect();
		} catch (error) {
			console.log(error);
			prisma.$disconnect();
		}
	}
}
