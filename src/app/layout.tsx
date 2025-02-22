import type { Metadata } from 'next'
import './globals.css'
import WalletContext from '@/contexts/walletContext'

export const metadata: Metadata = {
	title: 'Trinity',
	description: 'Tokenized identity platform for web3 communities.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<style>
				@import
				url('https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap');
			</style>
			<body>
				<WalletContext>{children}</WalletContext>
			</body>
		</html>
	)
}
