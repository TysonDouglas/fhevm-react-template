/**
 * Conversion utilities for FHEVM SDK
 * Provides data format conversion functions
 */

/**
 * Convert hexadecimal string to byte array
 *
 * @param hex - Hex string (with or without 0x prefix)
 * @returns Uint8Array of bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex

  // Validate hex string
  if (!/^[a-fA-F0-9]*$/.test(cleanHex)) {
    throw new Error('Invalid hex string')
  }

  // Ensure even length
  const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex

  const bytes = new Uint8Array(paddedHex.length / 2)
  for (let i = 0; i < paddedHex.length; i += 2) {
    bytes[i / 2] = parseInt(paddedHex.slice(i, i + 2), 16)
  }

  return bytes
}

/**
 * Convert byte array to hexadecimal string
 *
 * @param bytes - Byte array
 * @param prefix - Whether to include 0x prefix (default: true)
 * @returns Hex string
 */
export function bytesToHex(bytes: Uint8Array, prefix: boolean = true): string {
  const hex = Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')

  return prefix ? '0x' + hex : hex
}

/**
 * Parse encrypted value from contract response
 *
 * @param response - Raw contract response
 * @returns Parsed encrypted value object
 */
export function parseEncrypted(response: any): {
  handle: string
  type: string
  data?: string
} {
  // Handle different response formats
  if (typeof response === 'string') {
    return {
      handle: response,
      type: 'unknown'
    }
  }

  if (typeof response === 'object' && response !== null) {
    return {
      handle: response.handle || response.value || response.toString(),
      type: response.type || 'unknown',
      data: response.data
    }
  }

  throw new Error('Invalid encrypted response format')
}

/**
 * Convert number to specific uint type for encryption
 *
 * @param value - Numeric value
 * @param type - Target uint type
 * @returns Formatted value
 */
export function toUintType(
  value: number | bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' = 'uint8'
): bigint {
  const numValue = typeof value === 'bigint' ? value : BigInt(value)

  // Validate bounds
  const maxValues = {
    uint8: 255n,
    uint16: 65535n,
    uint32: 4294967295n,
    uint64: 18446744073709551615n,
    uint128: 340282366920938463463374607431768211455n,
    uint256: 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  }

  if (numValue < 0n || numValue > maxValues[type]) {
    throw new Error(`Value ${numValue} out of range for ${type}`)
  }

  return numValue
}

/**
 * Format bigint for display
 *
 * @param value - BigInt value
 * @param decimals - Number of decimal places (for token amounts)
 * @returns Formatted string
 */
export function formatBigInt(value: bigint, decimals: number = 0): string {
  if (decimals === 0) {
    return value.toString()
  }

  const divisor = 10n ** BigInt(decimals)
  const integerPart = value / divisor
  const fractionalPart = value % divisor

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  return `${integerPart}.${fractionalStr}`
}

/**
 * Parse bigint from string with decimals
 *
 * @param value - String value with decimals
 * @param decimals - Number of decimal places
 * @returns BigInt value
 */
export function parseBigInt(value: string, decimals: number = 0): bigint {
  if (decimals === 0) {
    return BigInt(value)
  }

  const [integerPart, fractionalPart = ''] = value.split('.')
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals)

  return BigInt(integerPart) * (10n ** BigInt(decimals)) + BigInt(paddedFractional)
}

/**
 * Convert encrypted handle to display format
 *
 * @param handle - Encrypted value handle
 * @returns Formatted display string
 */
export function formatHandle(handle: string): string {
  if (!handle || handle.length <= 12) {
    return handle
  }

  return `${handle.slice(0, 6)}...${handle.slice(-4)}`
}

/**
 * Encode function call data
 *
 * @param functionName - Function name
 * @param params - Function parameters
 * @returns Encoded call data
 */
export function encodeFunctionCall(functionName: string, params: any[]): string {
  // This is a simplified version
  // In a real implementation, this would use ethers.Interface or web3.eth.abi
  console.log(`Encoding call to ${functionName} with params:`, params)

  return '0x' + functionName
}

/**
 * Decode function result
 *
 * @param data - Encoded result data
 * @param returnTypes - Expected return types
 * @returns Decoded result
 */
export function decodeFunctionResult(data: string, returnTypes: string[]): any[] {
  // This is a simplified version
  // In a real implementation, this would use ethers.Interface or web3.eth.abi
  console.log(`Decoding result:`, data, returnTypes)

  return []
}
