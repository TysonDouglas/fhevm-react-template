/**
 * TypeScript type definitions for FHEVM SDK
 */

export interface FhevmConfig {
  network: 'sepolia' | 'localhost' | string
  provider?: any
  privateKey?: string
  contractAddress?: string
}

export interface NetworkConfig {
  chainId: number
  rpcUrl: string
  name: string
}

export interface FhevmInstance {
  network: string
  networkConfig: NetworkConfig
  provider?: any
  contractAddress?: string
  isInitialized: boolean
  publicKey: string | null
}

export interface EncryptOptions {
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
  publicKey?: string
}

export interface EncryptedValue {
  handle: string
  inputProof: string
  type: string
  timestamp: number
}

export interface DecryptOptions {
  userAddress?: string
  signature?: string
  contractAddress?: string
}

export interface DecryptedValue {
  value: number | bigint | string
  type: string
  timestamp: number
}

export interface ContractOptions {
  address: string
  abi: any[]
  signerOrProvider?: any
}

export interface FhevmContract {
  address: string
  abi: any[]
  call: (method: string, ...args: any[]) => Promise<any>
  send: (method: string, ...args: any[]) => Promise<any>
}

export interface EncryptedInput {
  handles: string[]
  inputProof: string
}

export interface FhevmContextValue {
  fhevm: FhevmInstance | null
  isInitialized: boolean
  error: Error | null
  init: (config: FhevmConfig) => Promise<void>
}
