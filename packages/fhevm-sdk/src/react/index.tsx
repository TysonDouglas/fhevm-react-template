/**
 * React integration for FHEVM SDK
 * Provides hooks and components for React applications
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initFhevm, encryptInput, decryptValue } from '../core'
import type { FhevmConfig, FhevmInstance, FhevmContextValue } from '../types'

// Create context
const FhevmContext = createContext<FhevmContextValue | null>(null)

/**
 * FHEVM Provider Component
 * Wraps your app to provide FHEVM functionality
 */
export function FhevmProvider({
  children,
  config
}: {
  children: React.ReactNode
  config: FhevmConfig
}) {
  const [fhevm, setFhevm] = useState<FhevmInstance | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const init = useCallback(async (cfg: FhevmConfig) => {
    try {
      const instance = await initFhevm(cfg)
      setFhevm(instance)
      setIsInitialized(true)
      setError(null)
    } catch (err) {
      setError(err as Error)
      setIsInitialized(false)
    }
  }, [])

  useEffect(() => {
    if (config) {
      init(config)
    }
  }, [config, init])

  const value: FhevmContextValue = {
    fhevm,
    isInitialized,
    error,
    init
  }

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>
}

/**
 * Hook to access FHEVM context
 */
export function useFhevm() {
  const context = useContext(FhevmContext)
  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider')
  }
  return context
}

/**
 * Hook for encryption operations
 */
export function useEncrypt() {
  const { fhevm, isInitialized } = useFhevm()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const encrypt = useCallback(async (value: number | bigint, options = {}) => {
    if (!fhevm || !isInitialized) {
      throw new Error('FHEVM not initialized')
    }

    setIsEncrypting(true)
    setError(null)

    try {
      const encrypted = await encryptInput(value, fhevm, options)
      return encrypted
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsEncrypting(false)
    }
  }, [fhevm, isInitialized])

  return {
    encrypt,
    isEncrypting,
    error
  }
}

/**
 * Hook for decryption operations
 */
export function useDecrypt() {
  const { fhevm, isInitialized } = useFhevm()
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const userDecrypt = useCallback(async (
    encryptedValue: string,
    contractAddress: string,
    options = {}
  ) => {
    if (!fhevm || !isInitialized) {
      throw new Error('FHEVM not initialized')
    }

    setIsDecrypting(true)
    setError(null)

    try {
      const decrypted = await decryptValue(encryptedValue, fhevm, {
        ...options,
        contractAddress
      })
      return decrypted
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsDecrypting(false)
    }
  }, [fhevm, isInitialized])

  const publicDecrypt = useCallback(async (encryptedValue: string) => {
    if (!fhevm || !isInitialized) {
      throw new Error('FHEVM not initialized')
    }

    // Public decryption logic
    return encryptedValue
  }, [fhevm, isInitialized])

  return {
    userDecrypt,
    publicDecrypt,
    isDecrypting,
    error
  }
}

/**
 * Hook for contract interactions
 */
export function useFhevmContract(options: {
  address: string
  abi: any[]
}) {
  const { fhevm, isInitialized } = useFhevm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const call = useCallback(async (method: string, ...args: any[]) => {
    if (!fhevm || !isInitialized) {
      throw new Error('FHEVM not initialized')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Contract call logic
      return null
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fhevm, isInitialized])

  const send = useCallback(async (method: string, ...args: any[]) => {
    if (!fhevm || !isInitialized) {
      throw new Error('FHEVM not initialized')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Contract send logic
      return null
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fhevm, isInitialized])

  return {
    contract: {
      address: options.address,
      abi: options.abi
    },
    call,
    send,
    isLoading,
    error
  }
}
