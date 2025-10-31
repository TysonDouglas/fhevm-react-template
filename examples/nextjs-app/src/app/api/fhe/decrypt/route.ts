/**
 * Decryption API Route
 * Decrypts values using FHEVM SDK
 */

import { NextRequest, NextResponse } from 'next/server'
import { decryptValue, initFhevm } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  try {
    const { encryptedValue, contractAddress, userAddress } = await request.json()

    if (!encryptedValue) {
      return NextResponse.json({
        success: false,
        error: 'Encrypted value is required'
      }, { status: 400 })
    }

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    })

    // Decrypt the value
    const decrypted = await decryptValue(encryptedValue, fhevm, {
      userAddress
    })

    return NextResponse.json({
      success: true,
      data: {
        encrypted: encryptedValue,
        decrypted,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('Decryption API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed'
    }, { status: 500 })
  }
}
