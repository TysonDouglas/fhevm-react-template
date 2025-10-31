/**
 * Key Management API Route
 * Handles FHE public key retrieval and management
 */

import { NextRequest, NextResponse } from 'next/server'
import { initFhevm } from '@fhevm/sdk'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractAddress = searchParams.get('contractAddress')

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    })

    // Get public key information
    return NextResponse.json({
      success: true,
      data: {
        publicKey: fhevm.publicKey || 'Public key available',
        network: fhevm.network,
        contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('Key Management API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve keys'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, contractAddress } = await request.json()

    if (action === 'refresh') {
      // Reinitialize FHEVM to refresh keys
      const fhevm = await initFhevm({
        network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
        contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      })

      return NextResponse.json({
        success: true,
        message: 'Keys refreshed successfully',
        timestamp: Date.now()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Key Management API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Operation failed'
    }, { status: 500 })
  }
}
