/**
 * FHE Operations API Route
 * Handles encryption and decryption operations on the server side
 */

import { NextRequest, NextResponse } from 'next/server'
import { encryptInput, initFhevm } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  try {
    const { operation, value, type } = await request.json()

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    })

    if (operation === 'encrypt') {
      // Encrypt the input value
      const encrypted = await encryptInput(value, fhevm, {
        type: type || 'uint32'
      })

      return NextResponse.json({
        success: true,
        encrypted,
        timestamp: Date.now()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid operation'
    }, { status: 400 })

  } catch (error) {
    console.error('FHE API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoints: {
      encrypt: 'POST /api/fhe { operation: "encrypt", value: number, type?: string }',
      decrypt: 'POST /api/fhe/decrypt',
      compute: 'POST /api/fhe/compute'
    },
    status: 'ready'
  })
}
