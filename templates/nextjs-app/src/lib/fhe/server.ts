/**
 * Server-side FHE Operations
 * Provides utility functions for server-side encryption operations
 */

import { initFhevm, encryptInput } from '@fhevm/sdk'

/**
 * Server-side encryption for API routes
 */
export async function serverEncrypt(
  value: number,
  type: string = 'uint32'
) {
  const fhevm = await initFhevm({
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  })

  return encryptInput(value, fhevm, { type: type as any })
}

/**
 * Validate encryption parameters
 */
export function validateEncryptionParams(value: any, type: string) {
  if (value === undefined || value === null) {
    throw new Error('Value is required')
  }

  const numValue = typeof value === 'string' ? parseInt(value) : value
  if (isNaN(numValue)) {
    throw new Error('Value must be a number')
  }

  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64']
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`)
  }

  return numValue
}
