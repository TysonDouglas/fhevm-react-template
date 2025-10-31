/**
 * Custom React Hooks for FHEVM Operations
 */

import { useState, useCallback } from 'react'
import { useFhevm } from '@fhevm/sdk/react'
import { encryptInput, decryptValue } from '@fhevm/sdk'

/**
 * Hook for encryption operations
 */
export function useEncrypt() {
  const { fhevm } = useFhevm()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const encrypt = useCallback(async (value: number, options?: any) => {
    if (!fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsEncrypting(true)
    setError(null)

    try {
      const encrypted = await encryptInput(value, fhevm, options)
      return encrypted
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed')
      setError(error)
      throw error
    } finally {
      setIsEncrypting(false)
    }
  }, [fhevm])

  return { encrypt, isEncrypting, error }
}

/**
 * Hook for decryption operations
 */
export function useDecrypt() {
  const { fhevm } = useFhevm()
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const userDecrypt = useCallback(async (encryptedValue: string, contractAddress?: string) => {
    if (!fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsDecrypting(true)
    setError(null)

    try {
      const decrypted = await fhevm.userDecrypt(encryptedValue, contractAddress)
      return decrypted
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Decryption failed')
      setError(error)
      throw error
    } finally {
      setIsDecrypting(false)
    }
  }, [fhevm])

  const publicDecrypt = useCallback(async (encryptedValue: string) => {
    if (!fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsDecrypting(true)
    setError(null)

    try {
      const decrypted = await fhevm.publicDecrypt(encryptedValue)
      return decrypted
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Public decryption failed')
      setError(error)
      throw error
    } finally {
      setIsDecrypting(false)
    }
  }, [fhevm])

  return { userDecrypt, publicDecrypt, isDecrypting, error }
}

/**
 * Hook for homomorphic computation operations
 */
export function useComputation() {
  const { fhevm } = useFhevm()
  const [isComputing, setIsComputing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const compute = useCallback(async (operation: string, operands: any[]) => {
    if (!fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsComputing(true)
    setError(null)

    try {
      // Perform homomorphic computation
      const result = await fhevm.compute(operation, operands)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Computation failed')
      setError(error)
      throw error
    } finally {
      setIsComputing(false)
    }
  }, [fhevm])

  return { compute, isComputing, error }
}
