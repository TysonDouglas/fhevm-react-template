/**
 * Constants and configuration for FHEVM SDK
 */

import type { NetworkConfig, FhevmConfig } from './types'

/**
 * Supported blockchain networks with their configurations
 */
export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    name: 'Sepolia Testnet'
  },
  localhost: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    name: 'Localhost'
  },
  mainnet: {
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    name: 'Ethereum Mainnet'
  },
  'zama-testnet': {
    chainId: 8009,
    rpcUrl: 'https://devnet.zama.ai',
    name: 'Zama Devnet'
  }
}

/**
 * Default FHEVM configuration
 */
export const DEFAULT_CONFIG: Partial<FhevmConfig> = {
  network: 'sepolia'
}

/**
 * Supported encrypted data types
 */
export const ENCRYPTED_TYPES = [
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'uint128',
  'uint256',
  'address',
  'bool'
] as const

export type EncryptedType = typeof ENCRYPTED_TYPES[number]

/**
 * Maximum values for each uint type
 */
export const MAX_UINT_VALUES = {
  uint8: 255n,
  uint16: 65535n,
  uint32: 4294967295n,
  uint64: 18446744073709551615n,
  uint128: 340282366920938463463374607431768211455n,
  uint256: 115792089237316195423570985008687907853269984665640564039457584007913129639935n
} as const

/**
 * FHE operation gas cost estimates (approximate)
 */
export const GAS_COSTS = {
  encrypt: {
    uint8: 50000,
    uint16: 60000,
    uint32: 70000,
    uint64: 90000,
    uint128: 120000,
    uint256: 150000
  },
  decrypt: {
    uint8: 40000,
    uint16: 50000,
    uint32: 60000,
    uint64: 80000,
    uint128: 100000,
    uint256: 130000
  },
  operations: {
    add: 30000,
    sub: 30000,
    mul: 50000,
    div: 60000,
    eq: 25000,
    ne: 25000,
    ge: 35000,
    gt: 35000,
    le: 35000,
    lt: 35000,
    min: 40000,
    max: 40000,
    and: 20000,
    or: 20000,
    xor: 25000,
    not: 15000,
    shl: 30000,
    shr: 30000
  }
} as const

/**
 * EIP-712 domain configuration for signatures
 */
export const EIP712_DOMAIN = {
  name: 'FHEVM',
  version: '1',
  salt: '0xfeedbeefc0dea1e5f00d'
} as const

/**
 * EIP-712 types for reencryption signatures
 */
export const EIP712_TYPES = {
  Reencrypt: [
    { name: 'publicKey', type: 'bytes' },
    { name: 'signature', type: 'bytes' }
  ]
} as const

/**
 * SDK version
 */
export const SDK_VERSION = '1.0.0'

/**
 * API endpoints for FHEVM gateway
 */
export const GATEWAY_ENDPOINTS = {
  sepolia: 'https://gateway.sepolia.zama.ai',
  localhost: 'http://localhost:8080',
  mainnet: 'https://gateway.zama.ai',
  'zama-testnet': 'https://gateway.devnet.zama.ai'
} as const

/**
 * Default timeout for operations (milliseconds)
 */
export const DEFAULT_TIMEOUT = 30000

/**
 * Maximum retry attempts for failed operations
 */
export const MAX_RETRIES = 3

/**
 * Retry delay in milliseconds
 */
export const RETRY_DELAY = 1000

/**
 * Cache TTL for public keys (milliseconds)
 */
export const PUBLIC_KEY_CACHE_TTL = 3600000 // 1 hour

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NOT_INITIALIZED: 'FHEVM not initialized. Call initFhevm() first.',
  INVALID_NETWORK: 'Invalid or unsupported network',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  INVALID_VALUE: 'Invalid value for encryption',
  INVALID_TYPE: 'Invalid encrypted type',
  MISSING_PROVIDER: 'Provider is required',
  MISSING_CONTRACT_ADDRESS: 'Contract address is required',
  MISSING_USER_ADDRESS: 'User address is required for decryption',
  ENCRYPTION_FAILED: 'Encryption operation failed',
  DECRYPTION_FAILED: 'Decryption operation failed',
  CONTRACT_CALL_FAILED: 'Contract call failed',
  SIGNATURE_REQUIRED: 'User signature is required for decryption'
} as const
