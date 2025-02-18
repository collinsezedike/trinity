import { NextRequest, NextResponse } from "next/server";
import {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";
import {
	createInitializeMetadataPointerInstruction,
	createInitializeMintInstruction,
	createInitializeNonTransferableMintInstruction,
	ExtensionType,
	getMintLen,
	LENGTH_SIZE,
	TOKEN_2022_PROGRAM_ID,
	TYPE_SIZE,
} from "@solana/spl-token";
import {
	createInitializeInstruction,
	createUpdateFieldInstruction,
	pack,
	TokenMetadata,
} from "@solana/spl-token-metadata";

import { CLUSTER_URL } from "@/lib/utils";

export async function POST(req: NextRequest) {
	try {
		const { name, symbol, description, image, authority } =
			await req.json();
		if (
			!name?.trim() ||
			!symbol?.trim() ||
			!description?.trim() ||
			!image?.trim() ||
			!authority?.trim()
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
			payer = new PublicKey(authority);
		} catch (error: any) {
			return NextResponse.json(
				{ error: "Invalid address provided: not a valid public key" },
				{ status: 500 }
			);
		}

		const connection = new Connection(CLUSTER_URL, "confirmed");
		const mintKeypair = Keypair.generate();
		const mint = mintKeypair.publicKey;
		const decimals = 2;
		const metaData: TokenMetadata = {
			updateAuthority: payer,
			mint,
			name,
			symbol,
			uri: "",
			additionalMetadata: [["description", description]],
		};
		const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
		const metadataLen = pack(metaData).length;
		const mintLen = getMintLen([
			ExtensionType.MetadataPointer,
			ExtensionType.NonTransferable,
		]);
		const lamports = await connection.getMinimumBalanceForRentExemption(
			mintLen + metadataExtension + metadataLen
		);

		const createAccountIxn = SystemProgram.createAccount({
			fromPubkey: payer,
			newAccountPubkey: mint,
			space: mintLen,
			lamports,
			programId: TOKEN_2022_PROGRAM_ID,
		});

		const initializeMetadataPointerIxn =
			createInitializeMetadataPointerInstruction(
				mint,
				payer,
				mint,
				TOKEN_2022_PROGRAM_ID
			);

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

		const initializeMetadataIxn = createInitializeInstruction({
			programId: TOKEN_2022_PROGRAM_ID,
			metadata: mint,
			updateAuthority: payer,
			mint: mint,
			mintAuthority: payer,
			name: metaData.name,
			symbol: metaData.symbol,
			uri: metaData.uri,
		});

		const updateFieldIxn = createUpdateFieldInstruction({
			programId: TOKEN_2022_PROGRAM_ID,
			metadata: mint,
			updateAuthority: payer,
			field: metaData.additionalMetadata[0][0],
			value: metaData.additionalMetadata[0][1],
		});

		const { blockhash } = await connection.getLatestBlockhash();

		const message = new TransactionMessage({
			payerKey: payer,
			recentBlockhash: blockhash,
			instructions: [
				createAccountIxn,
				initializeMetadataPointerIxn,
				initializeNonTransferableMintIxn,
				initializeMintIxn,
				initializeMetadataIxn,
				updateFieldIxn,
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
