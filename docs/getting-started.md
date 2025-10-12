# Getting Started with FHEVM SDK

Complete guide to integrating privacy-preserving encryption in your blockchain applications.

## Installation

Install the FHEVM SDK in your project:

```bash
npm install @fhevm/sdk
```

Or with yarn:

```bash
yarn add @fhevm/sdk
```

## Quick Start

### 1. Basic Setup (Node.js)

```typescript
import { initFhevm, encryptInput } from '@fhevm/sdk'

// Initialize FHEVM
const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
})

// Encrypt a value
const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })

console.log('Encrypted handle:', encrypted.handle)
console.log('Input proof:', encrypted.inputProof)
```

### 2. React Integration

```tsx
import { FhevmProvider, useEncrypt } from '@fhevm/sdk/react'

// Wrap your app with the provider
function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <EncryptComponent />
    </FhevmProvider>
  )
}

// Use the encryption hook
function EncryptComponent() {
  const { encrypt, isEncrypting } = useEncrypt()

  const handleEncrypt = async () => {
    const result = await encrypt(42, { type: 'uint8' })
    console.log(result)
  }

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  )
}
```

### 3. Next.js Integration

```tsx
// pages/_app.tsx
import { FhevmProvider } from '@fhevm/sdk/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <Component {...pageProps} />
    </FhevmProvider>
  )
}
```

## Core Concepts

### Initialization

Before using encryption features, initialize the FHEVM instance:

```typescript
import { initFhevm } from '@fhevm/sdk'

const fhevm = await initFhevm({
  network: 'sepolia',           // Network name
  contractAddress: '0x...',     // Your contract address
  provider: ethersProvider      // Optional: custom provider
})
```

### Encryption

#### Simple Encryption

```typescript
import { encryptInput } from '@fhevm/sdk'

// Encrypt a single value
const encrypted = await encryptInput(100, fhevm, { type: 'uint8' })
```

#### Batch Encryption

```typescript
import { createEncryptedInput } from '@fhevm/sdk'

// Encrypt multiple values in one proof
const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(performanceScore)    // 0-255
  .add16(experience)         // 0-65535
  .add32(salary)             // 0-4294967295
  .add64(bigNumber)          // Large numbers
  .encrypt()

// Use in contract call
await contract.submitData(
  encrypted.handles[0],  // First value handle
  encrypted.handles[1],  // Second value handle
  encrypted.handles[2],  // Third value handle
  encrypted.handles[3],  // Fourth value handle
  encrypted.inputProof   // Proof for all values
)
```

### Decryption

#### User Decryption (Requires Signature)

```typescript
import { userDecrypt } from '@fhevm/sdk'

// Decrypt value with EIP-712 signature
const decrypted = await userDecrypt(
  encryptedHandle,
  fhevm,
  {
    contractAddress: '0x...',
    userAddress: '0x...'
  }
)

console.log('Decrypted value:', decrypted.value)
```

#### Public Decryption

```typescript
import { publicDecrypt } from '@fhevm/sdk'

// Decrypt publicly available value
const decrypted = await publicDecrypt(encryptedHandle, fhevm)
```

## Supported Networks

```typescript
const networks = {
  'sepolia': {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/'
  },
  'localhost': {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545'
  },
  'zama-testnet': {
    chainId: 8009,
    rpcUrl: 'https://devnet.zama.ai'
  }
}
```

## Supported Data Types

| Type | Range | Gas Cost (approx) |
|------|-------|-------------------|
| uint8 | 0 - 255 | 50,000 |
| uint16 | 0 - 65,535 | 60,000 |
| uint32 | 0 - 4,294,967,295 | 70,000 |
| uint64 | 0 - 18,446,744,073,709,551,615 | 90,000 |
| uint128 | 0 - 2^128-1 | 120,000 |
| uint256 | 0 - 2^256-1 | 150,000 |

## Environment Setup

### For Development

Create a `.env` file:

```bash
# Network Configuration
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### For Production

Use environment variables or secrets management:

```bash
# Vercel
vercel env add NEXT_PUBLIC_NETWORK
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS

# Docker
docker run -e NEXT_PUBLIC_NETWORK=sepolia ...
```

## Common Patterns

### Pattern 1: Form Input Encryption

```tsx
import { useEncrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

function SensitiveForm() {
  const { encrypt } = useEncrypt()
  const [age, setAge] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Encrypt before sending to contract
    const encryptedAge = await encrypt(parseInt(age), { type: 'uint8' })

    // Submit to blockchain
    await contract.registerUser(
      encryptedAge.handle,
      encryptedAge.inputProof
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Enter your age"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Pattern 2: Server-Side Encryption

```typescript
// pages/api/encrypt.ts
import { initFhevm, encryptInput } from '@fhevm/sdk'

export default async function handler(req, res) {
  const fhevm = await initFhevm({
    network: process.env.NETWORK
  })

  const encrypted = await encryptInput(req.body.value, fhevm)

  res.json({ encrypted })
}
```

### Pattern 3: Reading Encrypted State

```typescript
import { useFhevmContract, useDecrypt } from '@fhevm/sdk/react'

function ReadEncryptedData() {
  const { call } = useFhevmContract({
    address: '0x...',
    abi: contractAbi
  })
  const { userDecrypt } = useDecrypt()

  const loadData = async () => {
    // Get encrypted handle from contract
    const encryptedHandle = await call('getMyData')

    // Decrypt with user signature
    const decrypted = await userDecrypt(
      encryptedHandle,
      contractAddress,
      { userAddress }
    )

    console.log('My data:', decrypted.value)
  }

  return <button onClick={loadData}>Load My Data</button>
}
```

## Error Handling

```typescript
import { encryptInput } from '@fhevm/sdk'

try {
  const encrypted = await encryptInput(value, fhevm)
} catch (error) {
  if (error.message === 'FHEVM not initialized') {
    // Initialize FHEVM first
    await initFhevm(config)
  } else if (error.message === 'Invalid value for encryption') {
    // Value out of range for type
    console.error('Value must be within uint8 range (0-255)')
  } else {
    // Other errors
    console.error('Encryption failed:', error)
  }
}
```

## TypeScript Support

The SDK is fully typed:

```typescript
import type {
  FhevmConfig,
  FhevmInstance,
  EncryptedValue,
  DecryptedValue,
  EncryptOptions
} from '@fhevm/sdk'

const config: FhevmConfig = {
  network: 'sepolia',
  contractAddress: '0x...'
}

const encrypted: EncryptedValue = await encryptInput(42, fhevm)
```

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [React Guide](./react-guide.md) - React-specific features
- [Next.js Guide](./nextjs-guide.md) - Next.js integration
- [Examples](../examples/) - Real-world examples
- [Best Practices](./best-practices.md) - Security and optimization

## Need Help?

- [GitHub Issues](https://github.com/...) - Report bugs
- [Discussions](https://github.com/.../discussions) - Ask questions
- [Zama Documentation](https://docs.zama.ai) - FHEVM details
