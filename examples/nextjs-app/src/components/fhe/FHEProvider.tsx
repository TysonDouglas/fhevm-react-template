/**
 * FHE Provider Component
 * Provides FHEVM context to child components
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { initFhevm } from '@fhevm/sdk'

interface FHEContextType {
  fhevm: any | null
  isInitialized: boolean
  error: Error | null
}

const FHEContext = createContext<FHEContextType>({
  fhevm: null,
  isInitialized: false,
  error: null,
})

export function useFHE() {
  const context = useContext(FHEContext)
  if (!context) {
    throw new Error('useFHE must be used within FHEProvider')
  }
  return context
}

interface FHEProviderProps {
  children: ReactNode
  config?: any
}

export function FHEProvider({ children, config }: FHEProviderProps) {
  const [fhevm, setFhevm] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const instance = await initFhevm(config || {
          network: 'sepolia'
        })
        setFhevm(instance)
        setIsInitialized(true)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM'))
      }
    }

    init()
  }, [config])

  return (
    <FHEContext.Provider value={{ fhevm, isInitialized, error }}>
      {children}
    </FHEContext.Provider>
  )
}
