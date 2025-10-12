/**
 * FHEVM Encryption Module
 * Handles input encryption using FHE
 */

import { FhevmInstance, EncryptOptions, EncryptedValue } from '../types'
import { validateValue } from '../utils/validation'

/**
 * Encrypt input value using FHE
 * @param value - Value to encrypt
 * @param fhevm - FHEVM instance
 * @param options - Encryption options
 * @returns Encrypted value with handle and proof
 */
export async function encryptInput(
  value: number | bigint,
  fhevm: FhevmInstance,
  options: EncryptOptions = {}
): Promise<EncryptedValue> {
  // Validate inputs
  if (!fhevm.isInitialized) {
    throw new Error('FHEVM instance not initialized')
  }

  const type = options.type || 'uint32'
  validateValue(value, type)

  // In production, this would use fhevmjs to encrypt
  // For now, we create a mock encrypted value
  const encrypted: EncryptedValue = {
    handle: `0x${Buffer.from(String(value)).toString('hex')}`,
    inputProof: '0x...',
    type,
    timestamp: Date.now()
  }

  return encrypted
}

/**
 * Create encrypted input builder
 * @param fhevm - FHEVM instance
 * @param userAddress - User's Ethereum address
 * @returns Encrypted input builder
 */
export function createEncryptedInput(
  fhevm: FhevmInstance,
  userAddress: string
) {
  const values: Array<{ value: number | bigint; type: string }> = []

  return {
    /**
     * Add uint8 value
     */
    add8(value: number) {
      values.push({ value, type: 'uint8' })
      return this
    },

    /**
     * Add uint16 value
     */
    add16(value: number) {
      values.push({ value, type: 'uint16' })
      return this
    },

    /**
     * Add uint32 value
     */
    add32(value: number) {
      values.push({ value, type: 'uint32' })
      return this
    },

    /**
     * Add uint64 value
     */
    add64(value: bigint) {
      values.push({ value, type: 'uint64' })
      return this
    },

    /**
     * Encrypt all added values
     */
    async encrypt() {
      const handles = await Promise.all(
        values.map(({ value, type }) =>
          encryptInput(value, fhevm, { type })
        )
      )

      return {
        handles: handles.map(h => h.handle),
        inputProof: handles[0]?.inputProof || '0x...'
      }
    }
  }
}
