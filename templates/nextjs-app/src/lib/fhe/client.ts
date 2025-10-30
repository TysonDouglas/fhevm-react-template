/**
 * Client-side FHE Operations
 * Provides utility functions for client-side encryption and decryption
 */

import { encryptInput, decryptValue, initFhevm } from '@fhevm/sdk'
import type { FhevmConfig, EncryptOptions } from '@/types/fhe'

/**
 * Encrypt a value for contract interaction
 */
export async function clientEncrypt(
  value: number,
  config: FhevmConfig,
  options?: EncryptOptions
) {
  const fhevm = await initFhevm(config)
  return encryptInput(value, fhevm, options)
}

/**
 * Decrypt a value from contract
 */
export async function clientDecrypt(
  encryptedValue: any,
  config: FhevmConfig,
  userAddress?: string
) {
  const fhevm = await initFhevm(config)
  return decryptValue(encryptedValue, fhevm, { userAddress })
}

/**
 * Batch encrypt multiple values
 */
export async function batchEncrypt(
  values: number[],
  config: FhevmConfig,
  options?: EncryptOptions
) {
  const fhevm = await initFhevm(config)
  return Promise.all(
    values.map(value => encryptInput(value, fhevm, options))
  )
}
