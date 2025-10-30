/**
 * Validation Utilities
 * Helper functions for data validation
 */

/**
 * Validate encryption parameters
 */
export function validateEncryptionParams(value: any, type?: string) {
  if (value === undefined || value === null) {
    throw new Error('Value is required')
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) {
    throw new Error('Value must be a valid number')
  }

  if (type) {
    const validTypes = ['uint8', 'uint16', 'uint32', 'uint64']
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`)
    }
  }

  return numValue
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(network: string) {
  const validNetworks = ['sepolia', 'localhost', 'mainnet']
  if (!validNetworks.includes(network)) {
    throw new Error(`Invalid network. Must be one of: ${validNetworks.join(', ')}`)
  }
  return true
}

/**
 * Validate contract address format
 */
export function validateContractAddress(address?: string) {
  if (!address) return true // Optional
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid contract address format')
  }
  return true
}
