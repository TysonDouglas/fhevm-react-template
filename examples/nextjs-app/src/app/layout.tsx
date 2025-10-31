/**
 * Root Layout - Next.js App Router
 * Provides FHEVM context to the entire application
 */

import { FhevmProvider } from '@fhevm/sdk/react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FHEVM Next.js Example',
  description: 'Privacy-preserving computation with Fully Homomorphic Encryption',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // FHEVM configuration from environment variables
  const fhevmConfig = {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  }

  return (
    <html lang="en">
      <body>
        <FhevmProvider config={fhevmConfig}>
          <div className="app-container">
            <header className="app-header">
              <h1>FHEVM Next.js Example</h1>
              <p>Privacy-preserving computation with Fully Homomorphic Encryption</p>
            </header>

            <main className="app-main">
              {children}
            </main>

            <footer className="app-footer">
              <p>
                Powered by{' '}
                <a href="https://docs.zama.ai" target="_blank" rel="noopener noreferrer">
                  Zama FHEVM
                </a>
              </p>
            </footer>
          </div>
        </FhevmProvider>
      </body>
    </html>
  )
}
