'use client'

/**
 * Computation Demo Component
 * Demonstrates homomorphic computation capabilities
 */

import { useState } from 'react'
import { useFhevm } from '@fhevm/sdk/react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

export default function ComputationDemo() {
  const { fhevm } = useFhevm()
  const [operand1, setOperand1] = useState('')
  const [operand2, setOperand2] = useState('')
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul'>('add')
  const [result, setResult] = useState<any>(null)
  const [isComputing, setIsComputing] = useState(false)

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!operand1 || !operand2) {
      alert('Please enter both operands')
      return
    }

    setIsComputing(true)
    try {
      // Simulate computation (actual computation would be on-chain)
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          operands: [parseInt(operand1), parseInt(operand2)]
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Computation failed:', err)
      alert(`Computation failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsComputing(false)
    }
  }

  const handleClear = () => {
    setOperand1('')
    setOperand2('')
    setResult(null)
  }

  return (
    <div className="form-container">
      <h3>Homomorphic Computation</h3>
      <p className="form-description">
        Perform computations on encrypted data without decrypting it.
        Operations are performed on-chain while preserving privacy.
      </p>

      <form onSubmit={handleCompute} className="compute-form">
        <div className="form-group">
          <label htmlFor="operand1">First Operand</label>
          <Input
            id="operand1"
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="Enter first number"
            disabled={isComputing}
          />
        </div>

        <div className="form-group">
          <label htmlFor="operation">Operation</label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            disabled={isComputing}
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (*)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="operand2">Second Operand</label>
          <Input
            id="operand2"
            type="number"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Enter second number"
            disabled={isComputing}
          />
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isComputing || !operand1 || !operand2}
          >
            {isComputing ? 'Computing...' : 'Compute'}
          </Button>

          {result && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={isComputing}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      {result && (
        <Card title="Computation Result">
          <div className="result-content">
            <div className="result-item">
              <span className="result-label">Operation:</span>
              <code className="result-value">{result.data?.operation}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Operands:</span>
              <code className="result-value">{JSON.stringify(result.data?.operands)}</code>
            </div>
            <div className="result-item">
              <span className="result-label">Status:</span>
              <code className="result-value highlight">
                {result.success ? 'Success' : 'Failed'}
              </code>
            </div>
          </div>

          <div className="info-section">
            <h4>About FHE Computations</h4>
            <div className="info-content">
              <div className="info-item">
                <strong>Privacy-Preserving:</strong>
                <p>Data remains encrypted during the entire computation process.</p>
              </div>
              <div className="info-item">
                <strong>On-Chain Execution:</strong>
                <p>Smart contracts perform operations on encrypted values directly.</p>
              </div>
              <div className="info-item">
                <strong>Verifiable:</strong>
                <p>All computations are recorded on the blockchain for transparency.</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="example-section">
        <h4>Example Usage</h4>
        <pre className="code-block">
{`// Encrypt two values
const enc1 = await encrypt(10)
const enc2 = await encrypt(5)

// Perform computation on-chain
const result = await contract.add(enc1.handle, enc2.handle)

// Result is still encrypted!
const decrypted = await userDecrypt(result)`}
        </pre>
      </div>
    </div>
  )
}
