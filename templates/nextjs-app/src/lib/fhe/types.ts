/**
 * FHE Type Definitions
 * Type definitions for FHE operations
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64'

export interface EncryptedValue {
  handle: string
  inputProof: string
  type: FHEDataType
  timestamp: number
}

export interface FHEConfig {
  network: string
  contractAddress?: string
  provider?: any
}

export interface EncryptionOptions {
  type?: FHEDataType
  publicKey?: string
}

export interface DecryptionOptions {
  userAddress?: string
  signature?: string
}

export interface ComputationRequest {
  operation: 'add' | 'sub' | 'mul' | 'div'
  operands: number[]
  contractAddress?: string
}
