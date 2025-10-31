/**
 * Encryption Hook
 * Simplified hook for encryption operations
 */

import { useState, useCallback } from 'react'
import { useFhevm } from '@fhevm/sdk/react'

export function useEncryption() {
  const { fhevm, isInitialized } = useFhevm()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptedValue, setEncryptedValue] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const encrypt = useCallback(async (value: number, type: string = 'uint32') => {
    if (!isInitialized || !fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsEncrypting(true)
    setError(null)
    setEncryptedValue(null)

    try {
      const encrypted = await fhevm.encrypt(value, { type })
      setEncryptedValue(encrypted)
      return encrypted
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed')
      setError(error)
      throw error
    } finally {
      setIsEncrypting(false)
    }
  }, [fhevm, isInitialized])

  const reset = useCallback(() => {
    setEncryptedValue(null)
    setError(null)
  }, [])

  return {
    encrypt,
    reset,
    isEncrypting,
    encryptedValue,
    error,
    isReady: isInitialized
  }
}
