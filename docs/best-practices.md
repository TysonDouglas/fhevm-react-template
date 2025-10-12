# Best Practices

Security, performance, and development best practices for FHEVM SDK.

## Security Best Practices

### 1. Never Expose Private Keys

❌ **DON'T:**
```typescript
// Never hardcode private keys
const fhevm = await initFhevm({
  network: 'sepolia',
  privateKey: '0x1234...' // BAD!
})
```

✅ **DO:**
```typescript
// Use environment variables
const fhevm = await initFhevm({
  network: process.env.NETWORK,
  privateKey: process.env.PRIVATE_KEY
})
```

### 2. Validate Input Before Encryption

❌ **DON'T:**
```typescript
// No validation
const encrypted = await encrypt(userInput)
```

✅ **DO:**
```typescript
import { validateValue } from '@fhevm/sdk'

// Validate before encrypting
if (!validateValue(userInput, 'uint8')) {
  throw new Error('Invalid input value')
}

const encrypted = await encrypt(userInput, { type: 'uint8' })
```

### 3. Use Server-Side Encryption for Sensitive Operations

❌ **DON'T:**
```typescript
// Client-side encryption with private data
const encrypted = await encrypt(socialSecurityNumber) // RISKY
```

✅ **DO:**
```typescript
// Server-side API route
// pages/api/encrypt-sensitive.ts
export default async function handler(req, res) {
  // Validate session
  const session = await getSession(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  // Encrypt on server
  const fhevm = await initFhevm({ network: process.env.NETWORK })
  const encrypted = await encryptInput(req.body.value, fhevm)

  res.json({ encrypted })
}
```

### 4. Verify Contract Addresses

```typescript
import { validateAddress } from '@fhevm/sdk'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

if (!validateAddress(contractAddress)) {
  throw new Error('Invalid contract address')
}

const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress
})
```

### 5. Handle Signature Requests Securely

```typescript
// Always explain to users why signature is needed
const handleDecrypt = async () => {
  try {
    // Show modal explaining signature purpose
    showSignatureModal('This signature is required to decrypt your private data')

    const decrypted = await userDecrypt(handle, contractAddress, { userAddress })

    // Success handling
  } catch (error) {
    if (error.code === 4001) {
      // User rejected signature
      console.log('User cancelled signature request')
    }
  }
}
```

## Performance Best Practices

### 1. Batch Encrypt Multiple Values

❌ **DON'T:**
```typescript
// Multiple separate encryptions (expensive!)
const encrypted1 = await encryptInput(value1, fhevm)
const encrypted2 = await encryptInput(value2, fhevm)
const encrypted3 = await encryptInput(value3, fhevm)

await contract.submit(
  encrypted1.handle, encrypted1.inputProof,
  encrypted2.handle, encrypted2.inputProof,
  encrypted3.handle, encrypted3.inputProof
)
```

✅ **DO:**
```typescript
// Single batch encryption (efficient!)
const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(value1)
  .add8(value2)
  .add8(value3)
  .encrypt()

await contract.submit(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.inputProof  // Single proof for all values
)
```

**Savings:** ~70% reduction in gas costs and encryption time

### 2. Cache FHEVM Instance

❌ **DON'T:**
```typescript
// Re-initializing on every operation
async function encryptData(value) {
  const fhevm = await initFhevm(config) // SLOW!
  return await encryptInput(value, fhevm)
}
```

✅ **DO:**
```typescript
// Initialize once, reuse everywhere
let fhevmInstance = null

async function getFhevm() {
  if (!fhevmInstance) {
    fhevmInstance = await initFhevm(config)
  }
  return fhevmInstance
}

async function encryptData(value) {
  const fhevm = await getFhevm() // FAST!
  return await encryptInput(value, fhevm)
}
```

Or use React context:
```typescript
const { fhevm } = useFhevm() // Already cached
```

### 3. Choose Appropriate Data Types

```typescript
// Use the smallest type that fits your data
const age = await encrypt(25, { type: 'uint8' })        // 0-255, ~50k gas
const year = await encrypt(2024, { type: 'uint16' })    // 0-65535, ~60k gas
const salary = await encrypt(75000, { type: 'uint32' }) // 0-4B, ~70k gas

// DON'T use uint256 for small numbers
const age = await encrypt(25, { type: 'uint256' }) // Wastes ~100k gas!
```

### 4. Implement Progressive Loading

```typescript
function EncryptForm() {
  const [step, setStep] = useState<'idle' | 'encrypting' | 'submitting' | 'done'>('idle')

  const handleSubmit = async () => {
    try {
      setStep('encrypting')
      const encrypted = await encrypt(value)

      setStep('submitting')
      const tx = await contract.submit(encrypted.handle, encrypted.inputProof)

      setStep('done')
    } catch (error) {
      setStep('idle')
    }
  }

  return (
    <div>
      {step === 'encrypting' && <Spinner>Encrypting data...</Spinner>}
      {step === 'submitting' && <Spinner>Submitting to blockchain...</Spinner>}
      {step === 'done' && <Success>Complete!</Success>}
    </div>
  )
}
```

### 5. Use Memoization for Expensive Computations

```typescript
import { useMemo } from 'react'

function EncryptedDisplay({ encryptedHandle }) {
  // Memoize formatted display
  const formattedHandle = useMemo(
    () => formatHandle(encryptedHandle),
    [encryptedHandle]
  )

  return <div>{formattedHandle}</div>
}
```

## Development Best Practices

### 1. Use TypeScript

```typescript
// Full type safety
import type { FhevmConfig, EncryptedValue } from '@fhevm/sdk'

const config: FhevmConfig = {
  network: 'sepolia',
  contractAddress: '0x...'
}

const encrypted: EncryptedValue = await encryptInput(42, fhevm)
```

### 2. Handle All Error Cases

```typescript
import { encryptInput, ERROR_MESSAGES } from '@fhevm/sdk'

async function safeEncrypt(value: number) {
  try {
    return await encryptInput(value, fhevm, { type: 'uint8' })
  } catch (error) {
    if (error.message === ERROR_MESSAGES.NOT_INITIALIZED) {
      // Re-initialize
      await initFhevm(config)
      return await encryptInput(value, fhevm, { type: 'uint8' })
    } else if (error.message === ERROR_MESSAGES.INVALID_VALUE) {
      // Show user-friendly error
      throw new Error(`Value must be between 0 and 255`)
    } else {
      // Log unexpected errors
      console.error('Encryption failed:', error)
      throw error
    }
  }
}
```

### 3. Use Environment-Specific Configuration

```typescript
// config/fhevm.ts
export const getFhevmConfig = () => {
  const env = process.env.NODE_ENV

  if (env === 'development') {
    return {
      network: 'localhost',
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }
  } else if (env === 'test') {
    return {
      network: 'sepolia',
      contractAddress: process.env.NEXT_PUBLIC_TEST_CONTRACT
    }
  } else {
    return {
      network: 'mainnet',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT
    }
  }
}
```

### 4. Add Comprehensive Logging

```typescript
const ENABLE_LOGGING = process.env.NODE_ENV === 'development'

async function encryptWithLogging(value: number) {
  if (ENABLE_LOGGING) {
    console.log('[Encrypt] Starting encryption for value:', value)
    console.time('encryption')
  }

  const encrypted = await encryptInput(value, fhevm)

  if (ENABLE_LOGGING) {
    console.timeEnd('encryption')
    console.log('[Encrypt] Handle:', encrypted.handle)
    console.log('[Encrypt] Proof length:', encrypted.inputProof.length)
  }

  return encrypted
}
```

### 5. Write Tests

```typescript
import { initFhevm, encryptInput, validateValue } from '@fhevm/sdk'

describe('Encryption', () => {
  let fhevm

  beforeAll(async () => {
    fhevm = await initFhevm({ network: 'localhost' })
  })

  it('should encrypt uint8 values', async () => {
    const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })

    expect(encrypted.handle).toBeDefined()
    expect(encrypted.inputProof).toBeDefined()
    expect(encrypted.type).toBe('uint8')
  })

  it('should validate input ranges', () => {
    expect(validateValue(255, 'uint8')).toBe(true)
    expect(validateValue(256, 'uint8')).toBe(false)
  })

  it('should throw for invalid values', async () => {
    await expect(
      encryptInput(-1, fhevm, { type: 'uint8' })
    ).rejects.toThrow('Invalid value')
  })
})
```

## UI/UX Best Practices

### 1. Show Encryption Progress

```typescript
function EncryptButton() {
  const { encrypt, isEncrypting } = useEncrypt()
  const [progress, setProgress] = useState(0)

  const handleEncrypt = async () => {
    setProgress(0)

    // Simulate progress (or use actual encryption events)
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90))
    }, 100)

    try {
      const result = await encrypt(value)
      setProgress(100)
    } finally {
      clearInterval(interval)
    }
  }

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt
      </button>
      {isEncrypting && <ProgressBar value={progress} />}
    </div>
  )
}
```

### 2. Provide Clear Feedback

```typescript
function EncryptForm() {
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const handleSubmit = async () => {
    try {
      const encrypted = await encrypt(value)
      setStatus({
        type: 'success',
        message: '✓ Data encrypted successfully'
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: `✗ Encryption failed: ${error.message}`
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>...</form>
      {status.type !== 'idle' && (
        <Alert type={status.type}>{status.message}</Alert>
      )}
    </div>
  )
}
```

### 3. Explain Privacy Benefits

```typescript
function PrivacyInfo() {
  return (
    <InfoBox>
      <h4>🔒 Your Data is Protected</h4>
      <p>
        All sensitive information is encrypted using Fully Homomorphic Encryption
        before leaving your device. Even the blockchain cannot see your actual data.
      </p>
      <ul>
        <li>✓ Data encrypted on your device</li>
        <li>✓ Computations on encrypted data</li>
        <li>✓ Only you can decrypt results</li>
      </ul>
    </InfoBox>
  )
}
```

## Testing Best Practices

### 1. Test with Local Network First

```bash
# Start local Hardhat node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npm test
```

### 2. Use Test Fixtures

```typescript
// test/fixtures.ts
export const testConfig = {
  network: 'localhost',
  contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
}

export const testValues = {
  validUint8: 42,
  invalidUint8: 256,
  validAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
}
```

### 3. Mock for Unit Tests

```typescript
// test/mocks.ts
export const mockFhevm = {
  network: 'localhost',
  isInitialized: true,
  networkConfig: { chainId: 31337, rpcUrl: 'http://localhost:8545' }
}

export const mockEncrypted = {
  handle: '0x1234...',
  inputProof: '0xabcd...',
  type: 'uint8',
  timestamp: Date.now()
}
```

## Deployment Checklist

- [ ] Remove all console.log statements in production
- [ ] Set proper environment variables
- [ ] Use production network configuration
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Implement rate limiting for API routes
- [ ] Add request validation middleware
- [ ] Set up monitoring and alerts
- [ ] Test on testnet before mainnet
- [ ] Verify contract addresses
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline
- [ ] Configure CORS properly
- [ ] Implement caching strategy
- [ ] Add analytics tracking
- [ ] Prepare rollback plan

## Common Pitfalls to Avoid

### 1. Re-encrypting Already Encrypted Data

```typescript
// DON'T double-encrypt
const encrypted = await encrypt(value)
const doubleEncrypted = await encrypt(encrypted.handle) // WRONG!

// DO submit encrypted data directly
await contract.submit(encrypted.handle, encrypted.inputProof)
```

### 2. Forgetting Input Proof

```typescript
// DON'T forget the proof
await contract.submit(encrypted.handle) // WILL FAIL!

// DO include both handle and proof
await contract.submit(encrypted.handle, encrypted.inputProof)
```

### 3. Using Wrong Data Type

```typescript
// DON'T mismatch types
const encrypted = await encrypt(1000, { type: 'uint8' }) // FAILS! (1000 > 255)

// DO use appropriate type
const encrypted = await encrypt(1000, { type: 'uint16' }) // WORKS
```

### 4. Not Handling Network Errors

```typescript
// DO handle network issues
const handleSubmit = async () => {
  try {
    const tx = await contract.submit(...)
    await tx.wait()
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      // Show retry option
      showRetryDialog()
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      // Prompt user to add funds
      showFundingDialog()
    }
  }
}
```

## Performance Monitoring

```typescript
// Track encryption performance
async function encryptWithMetrics(value: number) {
  const startTime = performance.now()

  const encrypted = await encryptInput(value, fhevm)

  const duration = performance.now() - startTime

  // Log to analytics
  analytics.track('encryption', {
    duration,
    type: 'uint8',
    success: true
  })

  return encrypted
}
```

## Resources

- [Security Audit Checklist](./security-audit.md)
- [Performance Optimization Guide](./performance.md)
- [Testing Guide](./testing.md)
- [Deployment Guide](./deployment.md)
