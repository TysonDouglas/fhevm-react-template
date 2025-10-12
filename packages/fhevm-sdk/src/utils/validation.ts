/**
 * Validation utilities for FHEVM SDK
 * Provides input validation and sanitization functions
 */

/**
 * Validate Ethereum address format
 *
 * @param address - Address to validate
 * @returns true if valid, false otherwise
 */
export function validateAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }

  // Check if it's a valid Ethereum address (0x + 40 hex characters)
  const addressRegex = /^0x[a-fA-F0-9]{40}$/
  return addressRegex.test(address)
}

/**
 * Validate encrypted value format
 *
 * @param value - Encrypted value to validate
 * @returns true if valid, false otherwise
 */
export function validateEncryptedValue(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // Check if it starts with 0x and has hex characters
  const hexRegex = /^0x[a-fA-F0-9]+$/
  return hexRegex.test(value)
}

/**
 * Validate numeric value for encryption
 *
 * @param value - Value to validate
 * @param type - Expected numeric type
 * @returns true if valid, false otherwise
 */
export function validateValue(
  value: number | bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' = 'uint8'
): boolean {
  const numValue = typeof value === 'bigint' ? value : BigInt(value)

  // Check if value is non-negative
  if (numValue < 0n) {
    return false
  }

  // Check bounds based on type
  const maxValues = {
    uint8: 255n,
    uint16: 65535n,
    uint32: 4294967295n,
    uint64: 18446744073709551615n,
    uint128: 340282366920938463463374607431768211455n,
    uint256: 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  }

  return numValue <= maxValues[type]
}

/**
 * Validate network configuration
 *
 * @param network - Network name to validate
 * @returns true if supported, false otherwise
 */
export function validateNetwork(network: string): boolean {
  const supportedNetworks = ['sepolia', 'localhost', 'mainnet', 'testnet']
  return supportedNetworks.includes(network.toLowerCase())
}

/**
 * Format encrypted value for display
 * Truncates long hex strings for readability
 *
 * @param encrypted - Encrypted value to format
 * @param length - Number of characters to show (default: 10)
 * @returns Formatted string
 */
export function formatEncrypted(encrypted: string, length: number = 10): string {
  if (!encrypted || encrypted.length <= length + 2) {
    return encrypted
  }

  return `${encrypted.slice(0, length + 2)}...${encrypted.slice(-4)}`
}

/**
 * Validate contract ABI
 *
 * @param abi - ABI to validate
 * @returns true if valid, false otherwise
 */
export function validateAbi(abi: any[]): boolean {
  if (!Array.isArray(abi) || abi.length === 0) {
    return false
  }

  // Check if all entries have required fields
  return abi.every(entry =>
    entry &&
    typeof entry === 'object' &&
    'type' in entry
  )
}

/**
 * Sanitize user input for contract calls
 *
 * @param input - User input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim()
  }

  if (typeof input === 'number' || typeof input === 'bigint') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key])
    }
    return sanitized
  }

  return input
}
