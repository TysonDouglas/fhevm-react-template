/**
 * Next.js App Component with FHEVM Provider
 * This wraps the entire application with the FHEVM context
 */

import type { AppProps } from 'next/app'
import { FhevmProvider } from '@fhevm/sdk/react'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  // FHEVM configuration
  const fhevmConfig = {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  }

  return (
    <FhevmProvider config={fhevmConfig}>
      <div className="app-container">
        <header className="app-header">
          <h1>FHEVM Next.js Example</h1>
          <p>Privacy-preserving computation with Fully Homomorphic Encryption</p>
        </header>

        <main className="app-main">
          <Component {...pageProps} />
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
  )
}
