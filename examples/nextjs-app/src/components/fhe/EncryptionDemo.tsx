'use client'

/**
 * Encryption Demo Component
 * Demonstrates client-side encryption with FHEVM SDK
 */

import { useState } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

export default function EncryptionDemo() {
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [value, setValue] = useState('')
  const [encryptedResult, setEncryptedResult] = useState<any>(null)
  const [dataType, setDataType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64'>('uint32')

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
          <Input
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
            <option value="uint64">uint64 (large numbers)</option>
          </select>
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isEncrypting || !value}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt'}
          </Button>

          {encryptedResult && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={isEncrypting}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {encryptedResult && (
        <Card title="Encryption Result">
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
        </Card>
      )}

      <div className="example-section">
        <h4>Example Usage</h4>
        <pre className="code-block">
{`// Encrypt a value
const encrypted = await encrypt(42, { type: 'uint32' })

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
