/**
 * @fhevm/sdk - Universal FHEVM SDK
 *
 * A framework-agnostic SDK for building confidential frontends with FHE.
 * Provides a wagmi-like developer experience for FHEVM applications.
 */

// Core exports
export { initFhevm, createFhevmInstance } from './core/init'
export { encryptInput, createEncryptedInput } from './core/encrypt'
export { decryptValue, userDecrypt, publicDecrypt } from './core/decrypt'
export { createFhevmContract, callContract } from './core/contract'

// Utility exports
export { validateAddress, validateValue, formatEncrypted } from './utils/validation'
export { hexToBytes, bytesToHex, parseEncrypted } from './utils/conversion'

// Type exports
export type {
  FhevmConfig,
  FhevmInstance,
  EncryptOptions,
  DecryptOptions,
  ContractOptions,
  NetworkConfig
} from './types'

// Constants
export { SUPPORTED_NETWORKS, DEFAULT_CONFIG } from './constants'

// Version
export const VERSION = '1.0.0'
