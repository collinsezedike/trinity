import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import {
	Connection,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'
import axios from 'axios'

import {
	createInitializeMintInstruction,
	createInitializeNonTransferableMintInstruction,
	ExtensionType,
	getMintLen,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { CLUSTER_URL } from '@/lib/utils'

const LandingPage = () => {
	const { publicKey, signTransaction, sendTransaction } = useWallet()
	// const connection = new Connection(CLUSTER_URL)

	const handleClick = async () => {
		if (!publicKey) {
			console.error('Wallet not connected!')
			return
		}

		const userWalletAddress = publicKey.toBase58()

		try {
			// Step 1: Fetch Serialized Transaction from Backend
			// const response = await axios.post('/onchain/create-token', {
			// 	name: 'tester',
			// 	symbol: 'TST',
			// 	description: 'This is a test',
			// 	image: 'runner',
			// 	authority: 'none',
			// 	address: userWalletAddress,
			// })

			// const serializedTxn = response.data.txn
			// console.log('Serialized Transaction:', serializedTxn)

			// // Step 2: Deserialize the Transaction
			// const txBuffer = Buffer.from(serializedTxn, 'base64')
			// const transaction = VersionedTransaction.deserialize(txBuffer)
			// console.log('Deserialized Transaction:', transaction)

			// Backend code
			const connection = new Connection(CLUSTER_URL)
			const { blockhash } = await connection.getLatestBlockhash()

			const mintKeypair = Keypair.generate()
			const mint = mintKeypair.publicKey
			const decimals = 2
			const mintLen = getMintLen([ExtensionType.NonTransferable])
			const lamports = await connection.getMinimumBalanceForRentExemption(
				mintLen
			)

			const createAccountIxn = SystemProgram.createAccount({
				fromPubkey: publicKey,
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
				publicKey,
				null,
				TOKEN_2022_PROGRAM_ID
			)

			const transferSOLIxn = SystemProgram.transfer({
				fromPubkey: publicKey,
				toPubkey: new PublicKey('DqZdf8MQkbJTkghf25cnzJNSmfmdzKseeVHxgL4qJKnw'),
				lamports: 1000,
			})

			const message = new TransactionMessage({
				payerKey: publicKey,
				recentBlockhash: blockhash,
				instructions: [
					// createAccountIxn,
					// initializeNonTransferableMintIxn,
					// initializeMintIxn,
					transferSOLIxn,
				],
			}).compileToV0Message()

			const txn = new VersionedTransaction(message)

			// Step 3: Sign the Transaction
			if (!signTransaction) {
				console.error('Wallet does not support signing!')
				return
			}

			const txnSignature = await sendTransaction(txn, connection)
			console.log('Transaction:', txn)
			console.log('Signed Transaction:', txnSignature)
		} catch (error: any) {
			console.error('Error processing transaction:', error)

			// Get full logs from transaction failure
			if (error.logs) {
				console.error('Transaction Logs:', error.logs)
			}
		}
	}

	return (
		<div
			style={{
				height: '100vh',
			}}
		>
			<nav>
				<h1>Trinity</h1>
				<WalletMultiButton />
			</nav>
			<div className="hero_section">
				<h2>Tokenized Identity</h2>
				<h2>For Web3 Communities</h2>
				<div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
					<button className="primary">Get Started</button>
					<button className="secondary">Learn more</button>
				</div>
			</div>
		</div>
	)
}

export default LandingPage
