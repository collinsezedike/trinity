import { NextRequest, NextResponse } from 'next/server'
import {
	createInitializeMintInstruction,
	createInitializeNonTransferableMintInstruction,
	ExtensionType,
	getMintLen,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'

import {
	createV1,
	findMetadataPda,
	mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
	createNoopSigner,
	percentAmount,
	publicKey,
	signerIdentity,
} from '@metaplex-foundation/umi'
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

import { CLUSTER_URL } from '@/lib/utils'

export async function POST(req: NextRequest) {
	try {
		const { name, symbol, description, image, authority, address } =
			await req.json()
		if (
			!name?.trim() ||
			!symbol?.trim() ||
			!description?.trim() ||
			!image?.trim() ||
			!address?.trim()
		) {
			return NextResponse.json(
				{
					error: 'name, symbol, description, image, and address are required',
				},
				{ status: 400 }
			)
		}

		let payer: PublicKey
		try {
			payer = new PublicKey(address)
		} catch (error: any) {
			return NextResponse.json(
				{ error: 'Invalid address provided: not a valid public key' },
				{ status: 500 }
			)
		}

		const connection = new Connection(CLUSTER_URL)

		const mintKeypair = Keypair.generate()
		const mint = mintKeypair.publicKey
		const decimals = 2
		const mintLen = getMintLen([ExtensionType.NonTransferable])
		const lamports = await connection.getMinimumBalanceForRentExemption(mintLen)

		const createAccountIxn = SystemProgram.createAccount({
			fromPubkey: payer,
			newAccountPubkey: mint,
			space: mintLen,
			lamports,
			programId: TOKEN_2022_PROGRAM_ID,
		})

		const initializeNonTransferableMintIxn =
			createInitializeNonTransferableMintInstruction(
				mint,
				TOKEN_2022_PROGRAM_ID
			)

		const initializeMintIxn = createInitializeMintInstruction(
			mint,
			decimals,
			payer,
			payer,
			TOKEN_2022_PROGRAM_ID
		)

		const umi = createUmi(CLUSTER_URL).use(mplTokenMetadata())
		// 	.use(irysUploader())
		// const metadata = { name, symbol, description, image }
		// const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
		// 	throw new Error(err)
		// })

		const mintAsUmiPublicKey = publicKey('YOUR_TOKEN_MINT_ADDRESS')
		const tokenMetadata = { name, symbol, uri: '' }
		umi.use(signerIdentity(createNoopSigner(publicKey(payer))))

		const metadataAccountAddress = await findMetadataPda(umi, {
			mint: mintAsUmiPublicKey,
		})

		const createMetadataIxn = createV1(umi, {
			mint: mintAsUmiPublicKey,
			authority: umi.identity,
			payer: umi.identity,
			updateAuthority: umi.identity,
			name: tokenMetadata.name,
			symbol: tokenMetadata.symbol,
			uri: tokenMetadata.uri,
			sellerFeeBasisPoints: percentAmount(0),
		})
			.getInstructions()
			.map(toWeb3JsInstruction)

		const { blockhash } = await connection.getLatestBlockhash()

		const message = new TransactionMessage({
			payerKey: payer,
			recentBlockhash: blockhash,
			instructions: [
				createAccountIxn,
				initializeNonTransferableMintIxn,
				initializeMintIxn,
				...createMetadataIxn,
			],
		}).compileToV0Message()

		const txn = new VersionedTransaction(message)
		txn.sign([mintKeypair])

		return NextResponse.json(txn, { status: 200 })
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message ? error.message : error },
			{ status: 500 }
		)
	}
}
