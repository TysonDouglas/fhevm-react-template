/**
 * Computation Hook
 * Handles homomorphic computation operations
 */

import { useState, useCallback } from 'react'
import { useFhevm } from '@fhevm/sdk/react'

export function useComputation() {
  const { fhevm, isInitialized } = useFhevm()
  const [isComputing, setIsComputing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  const add = useCallback(async (a: string, b: string) => {
    if (!isInitialized || !fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsComputing(true)
    setError(null)

    try {
      const sum = await fhevm.add(a, b)
      setResult(sum)
      return sum
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Addition failed')
      setError(error)
      throw error
    } finally {
      setIsComputing(false)
    }
  }, [fhevm, isInitialized])

  const subtract = useCallback(async (a: string, b: string) => {
    if (!isInitialized || !fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsComputing(true)
    setError(null)

    try {
      const difference = await fhevm.subtract(a, b)
      setResult(difference)
      return difference
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Subtraction failed')
      setError(error)
      throw error
    } finally {
      setIsComputing(false)
    }
  }, [fhevm, isInitialized])

  const multiply = useCallback(async (a: string, b: string) => {
    if (!isInitialized || !fhevm) {
      throw new Error('FHEVM not initialized')
    }

    setIsComputing(true)
    setError(null)

    try {
      const product = await fhevm.multiply(a, b)
      setResult(product)
      return product
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Multiplication failed')
      setError(error)
      throw error
    } finally {
      setIsComputing(false)
    }
  }, [fhevm, isInitialized])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    add,
    subtract,
    multiply,
    reset,
    isComputing,
    result,
    error,
    isReady: isInitialized
  }
}
