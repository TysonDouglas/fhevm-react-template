'use client'

/**
 * Key Manager Component
 * Manages FHE public keys and network configuration
 */

import { useState, useEffect } from 'react'
import { useFhevm } from '@fhevm/sdk/react'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function KeyManager() {
  const { fhevm, isInitialized } = useFhevm()
  const [keyInfo, setKeyInfo] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitialized) {
      fetchKeyInfo()
    }
  }, [isInitialized])

  const fetchKeyInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/keys')
      const data = await response.json()
      setKeyInfo(data)
    } catch (err) {
      console.error('Failed to fetch key info:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      const data = await response.json()

      if (data.success) {
        await fetchKeyInfo()
        alert('Keys refreshed successfully!')
      }
    } catch (err) {
      console.error('Failed to refresh keys:', err)
      alert(`Refresh failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading key information...</p>
      </div>
    )
  }

  return (
    <div className="form-container">
      <h3>FHE Key Management</h3>
      <p className="form-description">
        View and manage the FHE public keys used for encryption.
        Keys are automatically generated and managed by the FHEVM network.
      </p>

      {keyInfo?.success && (
        <Card title="Network Configuration">
          <div className="result-content">
            <div className="result-item">
              <span className="result-label">Network:</span>
              <code className="result-value">{keyInfo.data?.network || fhevm?.network}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Contract Address:</span>
              <code className="result-value truncate">{keyInfo.data?.contractAddress}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Public Key Status:</span>
              <code className="result-value highlight">
                {keyInfo.data?.publicKey ? 'Available' : 'Not Available'}
              </code>
            </div>
            <div className="result-item">
              <span className="result-label">Last Updated:</span>
              <code className="result-value">
                {new Date(keyInfo.data?.timestamp).toLocaleString()}
              </code>
            </div>
          </div>
        </Card>
      )}

      <div className="form-actions">
        <Button
          variant="primary"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Keys'}
        </Button>
      </div>

      <div className="info-section">
        <h4>About FHE Keys</h4>
        <div className="info-content">
          <div className="info-item">
            <strong>Public Key:</strong>
            <p>
              Used to encrypt data on the client side. The public key is shared and allows
              anyone to encrypt data that can only be processed by the FHEVM network.
            </p>
          </div>
          <div className="info-item">
            <strong>Private Key:</strong>
            <p>
              Managed securely by the FHEVM network. Never exposed to clients.
              Used for decryption operations authorized by smart contracts.
            </p>
          </div>
          <div className="info-item">
            <strong>Key Rotation:</strong>
            <p>
              Keys may be rotated periodically for security. The SDK automatically
              fetches the latest keys when needed.
            </p>
          </div>
        </div>
      </div>

      <div className="example-section">
        <h4>Example: Using Keys</h4>
        <pre className="code-block">
{`// Initialize with automatic key fetching
const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
})

// Keys are automatically used for encryption
const encrypted = await encryptInput(42, fhevm)

// Decryption requires EIP-712 signature
const decrypted = await userDecrypt(
  encryptedValue,
  contractAddress,
  userAddress
)`}
        </pre>
      </div>
    </div>
  )
}
