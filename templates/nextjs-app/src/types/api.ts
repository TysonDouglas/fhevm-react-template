/**
 * API Type Definitions
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: number
}

export interface EncryptRequest {
  value: number
  type?: string
  contractAddress?: string
}

export interface EncryptResponse {
  original: number
  encrypted: any
  type: string
  timestamp: number
}

export interface DecryptRequest {
  encryptedValue: any
  contractAddress?: string
  userAddress?: string
}

export interface DecryptResponse {
  encrypted: any
  decrypted: any
  timestamp: number
}

export interface ComputeRequest {
  operation: 'add' | 'sub' | 'mul'
  operands: number[]
  contractAddress?: string
}

export interface ComputeResponse {
  operation: string
  operands: number[]
  message: string
  timestamp: number
}
