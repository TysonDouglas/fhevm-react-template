'use client'

/**
 * Home Page - FHEVM Next.js Example
 * Demonstrates encryption, decryption, and contract interaction
 */

import { useState } from 'react'
import { useFhevm } from '@fhevm/sdk/react'
import EncryptionDemo from '@/components/fhe/EncryptionDemo'
import ComputationDemo from '@/components/fhe/ComputationDemo'
import KeyManager from '@/components/fhe/KeyManager'

export default function Home() {
  const { fhevm, isInitialized, error: initError } = useFhevm()
  const [activeTab, setActiveTab] = useState<'encrypt' | 'compute' | 'keys'>('encrypt')

  if (initError) {
    return (
      <div className="error-container">
        <h2>Initialization Error</h2>
        <p>{initError.message}</p>
        <p className="hint">
          Make sure you have configured NEXT_PUBLIC_NETWORK and NEXT_PUBLIC_CONTRACT_ADDRESS
          in your .env.local file
        </p>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Initializing FHEVM...</p>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="info-card">
        <h2>FHEVM Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">Network:</span>
            <span className="value">{fhevm?.network}</span>
          </div>
          <div className="status-item">
            <span className="label">Chain ID:</span>
            <span className="value">{fhevm?.networkConfig?.chainId}</span>
          </div>
          <div className="status-item">
            <span className="label">Status:</span>
            <span className="value status-active">✓ Initialized</span>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'encrypt' ? 'active' : ''}`}
            onClick={() => setActiveTab('encrypt')}
          >
            Encryption Demo
          </button>
          <button
            className={`tab ${activeTab === 'compute' ? 'active' : ''}`}
            onClick={() => setActiveTab('compute')}
          >
            Computation Demo
          </button>
          <button
            className={`tab ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            Key Manager
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'encrypt' && <EncryptionDemo />}
          {activeTab === 'compute' && <ComputationDemo />}
          {activeTab === 'keys' && <KeyManager />}
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Privacy-Preserving</h3>
            <p>All data encrypted using Fully Homomorphic Encryption</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast Integration</h3>
            <p>Simple API with React hooks for easy development</p>
          </div>
          <div className="feature-card">
            <h3>🔗 Smart Contract Ready</h3>
            <p>Seamless integration with FHEVM-enabled contracts</p>
          </div>
          <div className="feature-card">
            <h3>🛡️ Type-Safe</h3>
            <p>Full TypeScript support with comprehensive types</p>
          </div>
        </div>
      </div>

      <div className="documentation-section">
        <h2>Documentation</h2>
        <div className="doc-links">
          <a href="https://docs.zama.ai" className="doc-link" target="_blank" rel="noopener noreferrer">
            Getting Started →
          </a>
          <a href="https://docs.zama.ai/fhevm" className="doc-link" target="_blank" rel="noopener noreferrer">
            API Reference →
          </a>
          <a href="/api/fhe" className="doc-link">
            Examples →
          </a>
        </div>
      </div>
    </div>
  )
}
