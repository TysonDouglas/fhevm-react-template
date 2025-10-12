# API Reference

Complete reference for all FHEVM SDK functions, hooks, and types.

## Core Functions

### `initFhevm()`

Initialize the FHEVM instance before performing any operations.

```typescript
async function initFhevm(config: FhevmConfig): Promise<FhevmInstance>
```

**Parameters:**
- `config: FhevmConfig` - Configuration object

**Returns:** `Promise<FhevmInstance>` - Initialized FHEVM instance

**Example:**
```typescript
const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...',
  provider: ethersProvider  // Optional
})
```

---

### `encryptInput()`

Encrypt a single value for blockchain submission.

```typescript
async function encryptInput(
  value: number | bigint,
  fhevm: FhevmInstance,
  options?: EncryptOptions
): Promise<EncryptedValue>
```

**Parameters:**
- `value: number | bigint` - Value to encrypt
- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `options?: EncryptOptions` - Encryption options

**Returns:** `Promise<EncryptedValue>` - Encrypted value with handle and proof

**Example:**
```typescript
const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })
console.log(encrypted.handle)      // "0x..."
console.log(encrypted.inputProof)  // "0x..."
```

---

### `createEncryptedInput()`

Create a builder for encrypting multiple values with a single proof.

```typescript
function createEncryptedInput(
  fhevm: FhevmInstance,
  userAddress: string
): EncryptedInputBuilder
```

**Parameters:**
- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `userAddress: string` - User's Ethereum address

**Returns:** `EncryptedInputBuilder` - Builder for batch encryption

**Example:**
```typescript
const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(100)    // uint8
  .add16(5000)  // uint16
  .add32(1000000) // uint32
  .encrypt()

console.log(encrypted.handles)    // ["0x...", "0x...", "0x..."]
console.log(encrypted.inputProof) // "0x..."
```

---

### `userDecrypt()`

Decrypt a value with user-specific decryption (requires EIP-712 signature).

```typescript
async function userDecrypt(
  encryptedValue: string,
  fhevm: FhevmInstance,
  options: DecryptOptions
): Promise<DecryptedValue>
```

**Parameters:**
- `encryptedValue: string` - Encrypted handle from blockchain
- `fhevm: FhevmInstance` - Initialized FHEVM instance
- `options: DecryptOptions` - Decryption options with contract and user address

**Returns:** `Promise<DecryptedValue>` - Decrypted value

**Example:**
```typescript
const decrypted = await userDecrypt(
  encryptedHandle,
  fhevm,
  {
    contractAddress: '0x...',
    userAddress: '0x...'
  }
)
console.log(decrypted.value) // 42
```

---

### `publicDecrypt()`

Decrypt a publicly available encrypted value (no signature required).

```typescript
async function publicDecrypt(
  encryptedValue: string,
  fhevm: FhevmInstance
): Promise<DecryptedValue>
```

**Parameters:**
- `encryptedValue: string` - Encrypted handle
- `fhevm: FhevmInstance` - Initialized FHEVM instance

**Returns:** `Promise<DecryptedValue>` - Decrypted value

**Example:**
```typescript
const decrypted = await publicDecrypt(encryptedHandle, fhevm)
console.log(decrypted.value)
```

---

### `createFhevmContract()`

Create an FHEVM-enabled contract instance.

```typescript
function createFhevmContract(
  options: ContractOptions,
  fhevm: FhevmInstance
): FhevmContract
```

**Parameters:**
- `options: ContractOptions` - Contract configuration
- `fhevm: FhevmInstance` - Initialized FHEVM instance

**Returns:** `FhevmContract` - Contract instance with call/send methods

**Example:**
```typescript
const contract = createFhevmContract(
  {
    address: '0x...',
    abi: contractAbi,
    signerOrProvider: signer
  },
  fhevm
)

await contract.call('getData')
await contract.send('submitData', encryptedHandle, proof)
```

---

## React Hooks

### `useFhevm()`

Access the FHEVM context in React components.

```typescript
function useFhevm(): FhevmContextValue
```

**Returns:** `FhevmContextValue` - FHEVM context

**Example:**
```typescript
function MyComponent() {
  const { fhevm, isInitialized, error, init } = useFhevm()

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  return <div>Network: {fhevm.network}</div>
}
```

---

### `useEncrypt()`

Hook for encryption operations with loading states.

```typescript
function useEncrypt(): {
  encrypt: (value: number | bigint, options?: EncryptOptions) => Promise<EncryptedValue>
  isEncrypting: boolean
  error: Error | null
}
```

**Returns:** Object with encrypt function and state

**Example:**
```typescript
function EncryptButton() {
  const { encrypt, isEncrypting, error } = useEncrypt()

  const handleClick = async () => {
    const result = await encrypt(42, { type: 'uint8' })
    console.log(result.handle)
  }

  return (
    <button onClick={handleClick} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  )
}
```

---

### `useDecrypt()`

Hook for decryption operations with loading states.

```typescript
function useDecrypt(): {
  userDecrypt: (
    encryptedValue: string,
    contractAddress: string,
    options?: DecryptOptions
  ) => Promise<DecryptedValue>
  publicDecrypt: (encryptedValue: string) => Promise<DecryptedValue>
  isDecrypting: boolean
  error: Error | null
}
```

**Returns:** Object with decrypt functions and state

**Example:**
```typescript
function DecryptButton({ encryptedHandle }) {
  const { userDecrypt, isDecrypting } = useDecrypt()

  const handleClick = async () => {
    const result = await userDecrypt(
      encryptedHandle,
      contractAddress,
      { userAddress }
    )
    console.log(result.value)
  }

  return (
    <button onClick={handleClick} disabled={isDecrypting}>
      Decrypt
    </button>
  )
}
```

---

### `useFhevmContract()`

Hook for contract interactions with FHE support.

```typescript
function useFhevmContract(options: {
  address: string
  abi: any[]
}): {
  contract: { address: string; abi: any[] }
  call: (method: string, ...args: any[]) => Promise<any>
  send: (method: string, ...args: any[]) => Promise<any>
  isLoading: boolean
  error: Error | null
}
```

**Returns:** Object with contract methods and state

**Example:**
```typescript
function ContractInteraction() {
  const { call, send, isLoading } = useFhevmContract({
    address: '0x...',
    abi: contractAbi
  })

  const getData = async () => {
    const result = await call('getData')
    console.log(result)
  }

  const submitData = async (encrypted) => {
    const tx = await send('submitData', encrypted.handle, encrypted.inputProof)
    console.log(tx)
  }

  return <div>...</div>
}
```

---

## React Components

### `<FhevmProvider>`

Context provider for FHEVM functionality.

```typescript
function FhevmProvider({
  children: React.ReactNode
  config: FhevmConfig
}): JSX.Element
```

**Props:**
- `children: React.ReactNode` - Child components
- `config: FhevmConfig` - FHEVM configuration

**Example:**
```typescript
<FhevmProvider config={{ network: 'sepolia' }}>
  <App />
</FhevmProvider>
```

---

## Utility Functions

### `validateAddress()`

Validate Ethereum address format.

```typescript
function validateAddress(address: string): boolean
```

### `validateValue()`

Validate numeric value for encryption.

```typescript
function validateValue(
  value: number | bigint,
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
): boolean
```

### `hexToBytes()`

Convert hex string to byte array.

```typescript
function hexToBytes(hex: string): Uint8Array
```

### `bytesToHex()`

Convert byte array to hex string.

```typescript
function bytesToHex(bytes: Uint8Array, prefix?: boolean): string
```

### `formatHandle()`

Format encrypted handle for display.

```typescript
function formatHandle(handle: string): string
```

**Example:**
```typescript
formatHandle('0x1234567890abcdef...')
// Returns: "0x1234...cdef"
```

---

## TypeScript Types

### `FhevmConfig`

```typescript
interface FhevmConfig {
  network: 'sepolia' | 'localhost' | string
  provider?: any
  privateKey?: string
  contractAddress?: string
}
```

### `FhevmInstance`

```typescript
interface FhevmInstance {
  network: string
  networkConfig: NetworkConfig
  provider?: any
  contractAddress?: string
  isInitialized: boolean
  publicKey: string | null
}
```

### `EncryptedValue`

```typescript
interface EncryptedValue {
  handle: string
  inputProof: string
  type: string
  timestamp: number
}
```

### `DecryptedValue`

```typescript
interface DecryptedValue {
  value: number | bigint | string
  type: string
  timestamp: number
}
```

### `EncryptOptions`

```typescript
interface EncryptOptions {
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
  publicKey?: string
}
```

### `DecryptOptions`

```typescript
interface DecryptOptions {
  userAddress?: string
  signature?: string
  contractAddress?: string
}
```

### `ContractOptions`

```typescript
interface ContractOptions {
  address: string
  abi: any[]
  signerOrProvider?: any
}
```

---

## Constants

### `SUPPORTED_NETWORKS`

```typescript
const SUPPORTED_NETWORKS: Record<string, NetworkConfig>
```

### `MAX_UINT_VALUES`

```typescript
const MAX_UINT_VALUES: {
  uint8: 255n
  uint16: 65535n
  uint32: 4294967295n
  // ...
}
```

### `GAS_COSTS`

```typescript
const GAS_COSTS: {
  encrypt: { uint8: 50000, ... }
  decrypt: { uint8: 40000, ... }
  operations: { add: 30000, ... }
}
```

### `ERROR_MESSAGES`

```typescript
const ERROR_MESSAGES: {
  NOT_INITIALIZED: string
  INVALID_NETWORK: string
  // ...
}
```

---

## Error Handling

All async functions can throw errors. Wrap calls in try-catch:

```typescript
try {
  const encrypted = await encryptInput(value, fhevm)
} catch (error) {
  console.error('Operation failed:', error.message)
}
```

Common error messages:
- `FHEVM not initialized`
- `Invalid or unsupported network`
- `Invalid Ethereum address`
- `Invalid value for encryption`
- `Contract address is required`
- `User address is required for decryption`

---

## Gas Cost Estimates

| Operation | Type | Gas Cost |
|-----------|------|----------|
| Encryption | uint8 | ~50,000 |
| Encryption | uint32 | ~70,000 |
| Encryption | uint256 | ~150,000 |
| Decryption | uint8 | ~40,000 |
| Decryption | uint32 | ~60,000 |
| Add | - | ~30,000 |
| Multiply | - | ~50,000 |
| Compare | - | ~35,000 |

---

## Version

Current SDK version: `1.0.0`

For updates and changelogs, see the [GitHub releases](https://github.com/...).
