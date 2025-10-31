/**
 * FHE Key Management
 * Utilities for managing FHE public keys
 */

import { initFhevm } from '@fhevm/sdk'

/**
 * Fetch FHE public key for a contract
 */
export async function fetchPublicKey(
  network: string,
  contractAddress?: string
) {
  const fhevm = await initFhevm({
    network,
    contractAddress
  })

  return {
    publicKey: fhevm.publicKey,
    network: fhevm.network,
    contractAddress
  }
}

/**
 * Verify public key is valid
 */
export function validatePublicKey(publicKey: any): boolean {
  if (!publicKey) return false
  // Add more validation logic as needed
  return true
}

/**
 * Get key metadata
 */
export async function getKeyMetadata(
  network: string,
  contractAddress?: string
) {
  const keyInfo = await fetchPublicKey(network, contractAddress)

  return {
    ...keyInfo,
    isValid: validatePublicKey(keyInfo.publicKey),
    timestamp: Date.now()
  }
}
