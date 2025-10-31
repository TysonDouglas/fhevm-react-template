/**
 * Banking Example Component
 * Demonstrates privacy-preserving financial operations
 */

'use client'

import { useState } from 'react'
import { useEncrypt, useDecrypt } from '@/hooks/useFHE'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export function BankingExample() {
  const [balance, setBalance] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [encryptedBalance, setEncryptedBalance] = useState<string>('')
  const [decryptedBalance, setDecryptedBalance] = useState<string>('')

  const { encrypt, isEncrypting } = useEncrypt()
  const { userDecrypt, isDecrypting } = useDecrypt()

  const handleEncryptBalance = async () => {
    if (!balance) return
    try {
      const encrypted = await encrypt(parseInt(balance))
      setEncryptedBalance(encrypted)
    } catch (error) {
      console.error('Encryption failed:', error)
    }
  }

  const handleDecryptBalance = async () => {
    if (!encryptedBalance) return
    try {
      const decrypted = await userDecrypt(encryptedBalance)
      setDecryptedBalance(decrypted.toString())
    } catch (error) {
      console.error('Decryption failed:', error)
    }
  }

  return (
    <Card>
      <h2>Banking Example</h2>
      <p className="description">
        Privacy-preserving balance encryption and decryption
      </p>

      <div className="example-section">
        <h3>Encrypt Balance</h3>
        <Input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Enter balance amount"
        />
        <Button onClick={handleEncryptBalance} disabled={isEncrypting}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Balance'}
        </Button>
        {encryptedBalance && (
          <div className="result">
            <strong>Encrypted:</strong>
            <code>{encryptedBalance.slice(0, 32)}...</code>
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>Decrypt Balance</h3>
        <Button onClick={handleDecryptBalance} disabled={isDecrypting || !encryptedBalance}>
          {isDecrypting ? 'Decrypting...' : 'Decrypt Balance'}
        </Button>
        {decryptedBalance && (
          <div className="result">
            <strong>Decrypted Balance:</strong>
            <span className="value">${decryptedBalance}</span>
          </div>
        )}
      </div>

      <div className="info-box">
        <p>
          <strong>Privacy Note:</strong> The balance is encrypted on the client-side
          and only you can decrypt it using your private key signature.
        </p>
      </div>
    </Card>
  )
}
