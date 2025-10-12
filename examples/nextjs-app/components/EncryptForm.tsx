/**
 * Encrypt Form Component
 * Demonstrates client-side encryption with FHEVM SDK
 */

import { useState } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'

export default function EncryptForm() {
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [value, setValue] = useState('')
  const [encryptedResult, setEncryptedResult] = useState<any>(null)
  const [dataType, setDataType] = useState<'uint8' | 'uint16' | 'uint32'>('uint8')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!value) {
      alert('Please enter a value')
      return
    }

    const numValue = parseInt(value)
    if (isNaN(numValue)) {
      alert('Please enter a valid number')
      return
    }

    try {
      const encrypted = await encrypt(numValue, { type: dataType })
      setEncryptedResult(encrypted)
    } catch (err) {
      console.error('Encryption failed:', err)
      alert(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleClear = () => {
    setValue('')
    setEncryptedResult(null)
  }

  return (
    <div className="form-container">
      <h3>Encrypt Sensitive Data</h3>
      <p className="form-description">
        Encrypt your data using Fully Homomorphic Encryption before sending to the blockchain.
        The encrypted data can be processed without revealing its contents.
      </p>

      <form onSubmit={handleSubmit} className="encrypt-form">
        <div className="form-group">
          <label htmlFor="value">Value to Encrypt</label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            disabled={isEncrypting}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataType">Data Type</label>
          <select
            id="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value as any)}
            disabled={isEncrypting}
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65535)</option>
            <option value="uint32">uint32 (0-4294967295)</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isEncrypting || !value}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt'}
          </button>

          {encryptedResult && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isEncrypting}
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

      {encryptedResult && (
        <div className="result-container">
          <h4>Encryption Result</h4>
          <div className="result-content">
            <div className="result-item">
              <span className="result-label">Handle:</span>
              <code className="result-value">{encryptedResult.handle}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Input Proof:</span>
              <code className="result-value truncate">{encryptedResult.inputProof}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Type:</span>
              <code className="result-value">{encryptedResult.type}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Timestamp:</span>
              <code className="result-value">
                {new Date(encryptedResult.timestamp).toLocaleString()}
              </code>
            </div>
          </div>

          <div className="usage-hint">
            <strong>Next Steps:</strong>
            <p>
              Use the encrypted handle and input proof to submit to your smart contract.
              The contract can perform operations on this encrypted data without seeing the actual value.
            </p>
          </div>
        </div>
      )}

      <div className="example-section">
        <h4>Example Usage</h4>
        <pre className="code-block">
{`// Encrypt a value
const encrypted = await encrypt(42, { type: 'uint8' })

// Use in contract call
await contract.submitEncryptedData(
  encrypted.handle,
  encrypted.inputProof
)`}
        </pre>
      </div>
    </div>
  )
}
