import mongoose from "mongoose";

export type ContextParamsType = { params: { id: string } };

export async function connectDB() {
	if (mongoose.connection.readyState !== 1) {
		await mongoose.connect(process.env.DATABASE_URL as string);
	}
}
