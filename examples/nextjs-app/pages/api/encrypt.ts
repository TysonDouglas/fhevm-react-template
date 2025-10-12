/**
 * Server-side encryption API route
 * Demonstrates backend encryption using FHEVM SDK
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { initFhevm, encryptInput } from '@fhevm/sdk'

type EncryptRequest = {
  value: number | string
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64'
}

type EncryptResponse = {
  success: boolean
  encrypted?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EncryptResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { value, type = 'uint8' }: EncryptRequest = req.body

    // Validate input
    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'Value is required'
      })
    }

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NETWORK || 'sepolia',
      contractAddress: process.env.CONTRACT_ADDRESS
    })

    // Encrypt the value
    const encrypted = await encryptInput(value, fhevm, { type })

    // Return encrypted result
    return res.status(200).json({
      success: true,
      encrypted
    })
  } catch (error) {
    console.error('Encryption error:', error)

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    })
  }
}
