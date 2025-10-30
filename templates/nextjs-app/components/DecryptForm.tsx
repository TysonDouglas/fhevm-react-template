/**
 * Decrypt Form Component
 * Demonstrates decryption with user signature (EIP-712)
 */

import { useState } from 'react'
import { useDecrypt } from '@fhevm/sdk/react'

export default function DecryptForm() {
  const { userDecrypt, publicDecrypt, isDecrypting, error } = useDecrypt()
  const [encryptedValue, setEncryptedValue] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [decryptedResult, setDecryptedResult] = useState<any>(null)
  const [decryptionType, setDecryptionType] = useState<'user' | 'public'>('user')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!encryptedValue) {
      alert('Please enter an encrypted value')
      return
    }

    try {
      let result
      if (decryptionType === 'user') {
        if (!contractAddress || !userAddress) {
          alert('Contract address and user address are required for user decryption')
          return
        }

        result = await userDecrypt(encryptedValue, contractAddress, { userAddress })
      } else {
        result = await publicDecrypt(encryptedValue)
      }

      setDecryptedResult(result)
    } catch (err) {
      console.error('Decryption failed:', err)
      alert(`Decryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleClear = () => {
    setEncryptedValue('')
    setContractAddress('')
    setUserAddress('')
    setDecryptedResult(null)
  }

  return (
    <div className="form-container">
      <h3>Decrypt Encrypted Data</h3>
      <p className="form-description">
        Decrypt encrypted values from the blockchain. User decryption requires an EIP-712 signature
        to prove ownership, while public decryption works for values explicitly made public by the contract.
      </p>

      <form onSubmit={handleSubmit} className="decrypt-form">
        <div className="form-group">
          <label htmlFor="decryptionType">Decryption Type</label>
          <select
            id="decryptionType"
            value={decryptionType}
            onChange={(e) => setDecryptionType(e.target.value as any)}
            disabled={isDecrypting}
          >
            <option value="user">User Decryption (Requires Signature)</option>
            <option value="public">Public Decryption</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="encryptedValue">Encrypted Value Handle</label>
          <input
            id="encryptedValue"
            type="text"
            value={encryptedValue}
            onChange={(e) => setEncryptedValue(e.target.value)}
            placeholder="0x..."
            disabled={isDecrypting}
          />
        </div>

        {decryptionType === 'user' && (
          <>
            <div className="form-group">
              <label htmlFor="contractAddress">Contract Address</label>
              <input
                id="contractAddress"
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                disabled={isDecrypting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userAddress">User Address</label>
              <input
                id="userAddress"
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="0x..."
                disabled={isDecrypting}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isDecrypting || !encryptedValue}
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt'}
          </button>

          {decryptedResult && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isDecrypting}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {decryptedResult && (
        <div className="result-container">
          <h4>Decryption Result</h4>
          <div className="result-content">
            <div className="result-item">
              <span className="result-label">Decrypted Value:</span>
              <code className="result-value highlight">{decryptedResult.value.toString()}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Type:</span>
              <code className="result-value">{decryptedResult.type}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Timestamp:</span>
              <code className="result-value">
                {new Date(decryptedResult.timestamp).toLocaleString()}
              </code>
            </div>
          </div>

          <div className="success-hint">
            ✓ Decryption successful! The encrypted value has been revealed.
          </div>
        </div>
      )}

      <div className="info-section">
        <h4>About Decryption</h4>
        <div className="info-content">
          <div className="info-item">
            <strong>User Decryption:</strong>
            <p>
              Requires EIP-712 signature to prove you own the data. Used for private data
              that only specific users should access.
            </p>
          </div>
          <div className="info-item">
            <strong>Public Decryption:</strong>
            <p>
              Works for values that have been explicitly made public by the smart contract.
              No signature required.
            </p>
          </div>
        </div>
      </div>

      <div className="example-section">
        <h4>Example Usage</h4>
        <pre className="code-block">
{`// User decryption (requires signature)
const result = await userDecrypt(
  encryptedHandle,
  contractAddress,
  { userAddress }
)

// Public decryption
const publicResult = await publicDecrypt(
  encryptedHandle
)`}
        </pre>
      </div>
    </div>
  )
}
