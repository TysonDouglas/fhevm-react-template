/**
 * Server-side decryption API route
 * Demonstrates backend decryption using FHEVM SDK
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { initFhevm, decryptValue } from '@fhevm/sdk'

type DecryptRequest = {
  encryptedValue: string
  contractAddress?: string
  userAddress?: string
  signature?: string
}

type DecryptResponse = {
  success: boolean
  decrypted?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DecryptResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const {
      encryptedValue,
      contractAddress,
      userAddress,
      signature
    }: DecryptRequest = req.body

    // Validate input
    if (!encryptedValue) {
      return res.status(400).json({
        success: false,
        error: 'Encrypted value is required'
      })
    }

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NETWORK || 'sepolia',
      contractAddress: process.env.CONTRACT_ADDRESS
    })

    // Decrypt the value
    const decrypted = await decryptValue(encryptedValue, fhevm, {
      contractAddress,
      userAddress,
      signature
    })

    // Return decrypted result
    return res.status(200).json({
      success: true,
      decrypted
    })
  } catch (error) {
    console.error('Decryption error:', error)

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed'
    })
  }
}
