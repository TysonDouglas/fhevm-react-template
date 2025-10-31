/**
 * Encryption API Route
 * Encrypts values using FHEVM SDK
 */

import { NextRequest, NextResponse } from 'next/server'
import { encryptInput, initFhevm } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint32', contractAddress } = await request.json()

    if (value === undefined || value === null) {
      return NextResponse.json({
        success: false,
        error: 'Value is required'
      }, { status: 400 })
    }

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    })

    // Encrypt the input value
    const encrypted = await encryptInput(value, fhevm, { type })

    return NextResponse.json({
      success: true,
      data: {
        original: value,
        encrypted,
        type,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('Encryption API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    }, { status: 500 })
  }
}
