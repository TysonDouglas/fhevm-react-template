/**
 * FHEVM Initialization Module
 * Handles FHE instance creation and configuration
 */

import { FhevmConfig, FhevmInstance, NetworkConfig } from '../types'
import { validateAddress } from '../utils/validation'

const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    name: 'Sepolia'
  },
  localhost: {
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    name: 'Localhost'
  }
}

/**
 * Initialize FHEVM instance
 * @param config - Configuration options
 * @returns Initialized FHEVM instance
 */
export async function initFhevm(config: FhevmConfig): Promise<FhevmInstance> {
  // Validate configuration
  if (!config.network || !NETWORK_CONFIGS[config.network]) {
    throw new Error(`Unsupported network: ${config.network}`)
  }

  if (config.contractAddress && !validateAddress(config.contractAddress)) {
    throw new Error(`Invalid contract address: ${config.contractAddress}`)
  }

  const networkConfig = NETWORK_CONFIGS[config.network]

  // Create instance
  const instance: FhevmInstance = {
    network: config.network,
    networkConfig,
    provider: config.provider,
    contractAddress: config.contractAddress,
    isInitialized: true,
    publicKey: null // Will be set during encryption
  }

  return instance
}

/**
 * Create FHEVM instance with custom configuration
 * @param config - Custom configuration
 * @returns FHEVM instance
 */
export function createFhevmInstance(config: Partial<FhevmConfig>): FhevmInstance {
  return {
    network: config.network || 'sepolia',
    networkConfig: NETWORK_CONFIGS[config.network || 'sepolia'],
    provider: config.provider,
    contractAddress: config.contractAddress,
    isInitialized: false,
    publicKey: null
  }
}

/**
 * Get network configuration
 * @param network - Network name
 * @returns Network configuration
 */
export function getNetworkConfig(network: string): NetworkConfig | null {
  return NETWORK_CONFIGS[network] || null
}
