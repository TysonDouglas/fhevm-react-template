/**
 * FHE Type Definitions for Next.js Application
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64'

export interface FhevmConfig {
  network: string
  contractAddress?: string
  provider?: any
  privateKey?: string
}

export interface EncryptOptions {
  type?: FHEDataType
  publicKey?: string
}

export interface DecryptOptions {
  userAddress?: string
  signature?: string
}

export interface EncryptedData {
  handle: string
  inputProof: string
  type: FHEDataType
  timestamp: number
}

export interface FHEVMInstance {
  network: string
  networkConfig: {
    chainId: number
  }
  publicKey?: string
}
