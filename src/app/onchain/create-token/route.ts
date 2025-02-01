import { NextRequest, NextResponse } from "next/server";
import {
	createInitializeMintInstruction,
	createInitializeNonTransferableMintInstruction,
	ExtensionType,
	getMintLen,
	TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { CLUSTER_URL } from "@/lib/utils";

export async function POST(req: NextRequest) {
	try {
		const { name, symbol, description, image, authority, address } =
			await req.json();
		if (
			!name?.trim() ||
			!symbol?.trim() ||
			!description?.trim() ||
			!image?.trim() ||
			!authority?.trim() ||
			!address?.trim()
		) {
			return NextResponse.json(
				{
					error: "name, symbol, description, image, authority and address are required",
				},
				{ status: 400 }
			);
		}

		let payer: PublicKey;
		try {
			payer = new PublicKey(address);
		} catch (error: any) {
			return NextResponse.json(
				{ error: "Invalid address provided: not a valid public key" },
				{ status: 500 }
			);
		}

		const connection = new Connection(CLUSTER_URL);
		const { blockhash } = await connection.getLatestBlockhash();

		const mintKeypair = Keypair.generate();
		const mint = mintKeypair.publicKey;
		const decimals = 2;
		const mintLen = getMintLen([ExtensionType.NonTransferable]);
		const lamports = await connection.getMinimumBalanceForRentExemption(
			mintLen
		);

		const createAccountIxn = SystemProgram.createAccount({
			fromPubkey: payer,
			newAccountPubkey: mint,
			space: mintLen,
			lamports,
			programId: TOKEN_2022_PROGRAM_ID,
		});

		const initializeNonTransferableMintIxn =
			createInitializeNonTransferableMintInstruction(
				mint,
				TOKEN_2022_PROGRAM_ID
			);

		const initializeMintIxn = createInitializeMintInstruction(
			mint,
			decimals,
			payer,
			payer,
			TOKEN_2022_PROGRAM_ID
		);

		const message = new TransactionMessage({
			payerKey: payer,
			recentBlockhash: blockhash,
			instructions: [
				createAccountIxn,
				initializeNonTransferableMintIxn,
				initializeMintIxn,
			],
		}).compileToV0Message();

		const txn = new VersionedTransaction(message);
		txn.sign([mintKeypair]);

		return NextResponse.json(txn, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		);
	}
}
