import mongoose from "mongoose";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export type ContextParamsType = { params: Promise<{ id: string }> };

export const CLUSTER_URL = clusterApiUrl("devnet");

export async function connectDB() {
	if (mongoose.connection.readyState !== 1) {
		await mongoose.connect(process.env.DATABASE_URL as string);
	}
}

export async function isValidSignature(signature: string) {
	try {
		const connection = new Connection(CLUSTER_URL);
		let status = await connection.getSignatureStatus(signature);
		if (!status) throw new Error("Unknown signature status");
		if (status.value?.confirmationStatus) {
			if (
				status.value.confirmationStatus != "confirmed" &&
				status.value.confirmationStatus != "finalized"
			) {
				throw new Error("Unable to confirm the transaction");
			}
		}
		return true;
	} catch (err) {
		throw err;
	}
}
