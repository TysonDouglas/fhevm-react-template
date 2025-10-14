# Migration Guide

Guide for migrating from fhevmjs or other FHEVM libraries to the Universal FHEVM SDK.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [From fhevmjs](#from-fhevmjs)
- [From tfhe-rs](#from-tfhe-rs)
- [Breaking Changes](#breaking-changes)
- [Migration Checklist](#migration-checklist)
- [Common Issues](#common-issues)

## Why Migrate?

### Benefits of Universal FHEVM SDK

1. **Framework Agnostic** - Works with React, Next.js, Vue, Node.js
2. **Unified API** - Single package, consistent interface
3. **Better DX** - Wagmi-like hooks, familiar patterns
4. **TypeScript First** - Full type safety
5. **Well Documented** - Comprehensive guides and examples
6. **Active Maintenance** - Regular updates and support

### Comparison

| Feature | Universal FHEVM SDK | fhevmjs | tfhe-rs |
|---------|---------------------|---------|---------|
| Framework Support | ✅ All | ❌ Limited | ❌ Rust only |
| React Hooks | ✅ Yes | ❌ No | ❌ No |
| TypeScript | ✅ Full | ⚠️ Partial | ❌ No |
| Documentation | ✅ Extensive | ⚠️ Basic | ⚠️ Limited |
| Bundle Size | ✅ Optimized | ⚠️ Large | N/A |

## From fhevmjs

### Package Installation

**Before (fhevmjs):**
```bash
npm install fhevmjs
```

**After (Universal FHEVM SDK):**
```bash
npm install @fhevm/sdk ethers
```

### Initialization

**Before:**
```javascript
import { createInstance } from 'fhevmjs'

const instance = await createInstance({
  chainId: 11155111,
  publicKey: '...'
})
```

**After:**
```typescript
import { initFhevm } from '@fhevm/sdk'

const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
})
```

### Encryption

**Before:**
```javascript
import { createEncryptedInput } from 'fhevmjs'

const input = instance.createEncryptedInput(contractAddress, userAddress)
input.add8(42)
input.add16(1000)
const encryptedInput = input.encrypt()
```

**After:**
```typescript
import { createEncryptedInput } from '@fhevm/sdk'

const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(42)
  .add16(1000)
  .encrypt()
```

### Single Value Encryption

**Before:**
```javascript
const encrypted = await instance.encrypt8(42)
```

**After:**
```typescript
import { encryptInput } from '@fhevm/sdk'

const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })
```

### Decryption

**Before:**
```javascript
const decrypted = await instance.decrypt(
  contractAddress,
  encryptedValue
)
```

**After:**
```typescript
import { userDecrypt } from '@fhevm/sdk'

const decrypted = await userDecrypt(
  encryptedValue,
  fhevm,
  {
    contractAddress,
    userAddress
  }
)
```

### React Integration

**Before (Manual Setup):**
```javascript
import { createInstance } from 'fhevmjs'
import { useState, useEffect } from 'react'

function App() {
  const [instance, setInstance] = useState(null)

  useEffect(() => {
    async function init() {
      const fhevmInstance = await createInstance({ chainId: 11155111 })
      setInstance(fhevmInstance)
    }
    init()
  }, [])

  if (!instance) return <div>Loading...</div>

  return <YourApp instance={instance} />
}
```

**After (Provider Pattern):**
```typescript
import { FhevmProvider, useFhevm } from '@fhevm/sdk/react'

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  )
}

function YourApp() {
  const { fhevm, isInitialized } = useFhevm()

  if (!isInitialized) return <div>Loading...</div>

  return <div>Ready!</div>
}
```

### Complete Migration Example

**Before (fhevmjs):**
```javascript
import { createInstance, createEncryptedInput } from 'fhevmjs'
import { ethers } from 'ethers'

async function main() {
  // Initialize
  const instance = await createInstance({
    chainId: 11155111,
    publicKey: await getPublicKey()
  })

  // Create encrypted input
  const input = instance.createEncryptedInput(contractAddress, userAddress)
  input.add8(42)
  input.add16(1000)
  const { handles, inputProof } = input.encrypt()

  // Submit to contract
  const contract = new ethers.Contract(contractAddress, abi, signer)
  await contract.submitData(handles[0], handles[1], inputProof)

  // Decrypt
  const encryptedResult = await contract.getData()
  const decrypted = await instance.decrypt(contractAddress, encryptedResult)
  console.log('Result:', decrypted)
}
```

**After (Universal FHEVM SDK):**
```typescript
import { initFhevm, createEncryptedInput, userDecrypt } from '@fhevm/sdk'
import { ethers } from 'ethers'

async function main() {
  // Initialize
  const fhevm = await initFhevm({
    network: 'sepolia',
    contractAddress
  })

  // Create encrypted input
  const encrypted = await createEncryptedInput(fhevm, userAddress)
    .add8(42)
    .add16(1000)
    .encrypt()

  // Submit to contract
  const contract = new ethers.Contract(contractAddress, abi, signer)
  await contract.submitData(
    encrypted.handles[0],
    encrypted.handles[1],
    encrypted.inputProof
  )

  // Decrypt
  const encryptedResult = await contract.getData()
  const decrypted = await userDecrypt(encryptedResult, fhevm, {
    contractAddress,
    userAddress
  })
  console.log('Result:', decrypted.value)
}
```

## From tfhe-rs

### Rust to JavaScript

**Before (tfhe-rs):**
```rust
use tfhe::prelude::*;
use tfhe::{generate_keys, ConfigBuilder, FheUint8};

fn main() {
    let config = ConfigBuilder::default().build();
    let (client_key, server_key) = generate_keys(config);

    let clear_a = 27u8;
    let a = FheUint8::encrypt(clear_a, &client_key);

    let result: u8 = a.decrypt(&client_key);
}
```

**After (Universal FHEVM SDK):**
```typescript
import { initFhevm, encryptInput, userDecrypt } from '@fhevm/sdk'

async function main() {
  const fhevm = await initFhevm({
    network: 'sepolia',
    contractAddress: '0x...'
  })

  const clearValue = 27
  const encrypted = await encryptInput(clearValue, fhevm, { type: 'uint8' })

  // Use encrypted.handle with smart contract...

  const decrypted = await userDecrypt(encryptedHandle, fhevm, {
    contractAddress,
    userAddress
  })
  console.log('Result:', decrypted.value)
}
```

## Breaking Changes

### v1.0.0 Changes

#### 1. Import Paths

**Before:**
```typescript
import { init, encrypt } from '@fhevm/sdk'
```

**After:**
```typescript
import { initFhevm, encryptInput } from '@fhevm/sdk'
```

#### 2. Function Names

| Old Name | New Name |
|----------|----------|
| `init()` | `initFhevm()` |
| `encrypt()` | `encryptInput()` |
| `decrypt()` | `decryptValue()` |
| `createInput()` | `createEncryptedInput()` |

#### 3. Configuration Object

**Before:**
```typescript
const config = {
  chainId: 11155111,
  rpcUrl: '...',
  publicKey: '...'
}
```

**After:**
```typescript
const config = {
  network: 'sepolia',
  contractAddress: '0x...',
  provider: ethersProvider  // optional
}
```

#### 4. Encrypted Value Structure

**Before:**
```typescript
{
  ciphertext: '0x...',
  proof: '0x...'
}
```

**After:**
```typescript
{
  handle: '0x...',
  inputProof: '0x...',
  type: 'uint8',
  timestamp: 1234567890
}
```

#### 5. Decryption Options

**Before:**
```typescript
decrypt(contractAddress, encryptedValue)
```

**After:**
```typescript
userDecrypt(encryptedValue, fhevm, {
  contractAddress,
  userAddress
})
```

## Migration Checklist

### Phase 1: Preparation

- [ ] Review current FHEVM usage in codebase
- [ ] Identify all encryption/decryption points
- [ ] Check smart contract compatibility
- [ ] Backup current implementation
- [ ] Set up test environment

### Phase 2: Installation

- [ ] Install `@fhevm/sdk` package
- [ ] Install `ethers` if not already present
- [ ] Update `package.json` dependencies
- [ ] Remove old FHEVM packages
- [ ] Run `npm install`

### Phase 3: Code Migration

- [ ] Update all import statements
- [ ] Replace initialization code
- [ ] Update encryption calls
- [ ] Update decryption calls
- [ ] Migrate to React hooks (if using React)
- [ ] Update TypeScript types

### Phase 4: Testing

- [ ] Test initialization
- [ ] Test encryption functions
- [ ] Test decryption functions
- [ ] Test contract interactions
- [ ] Run integration tests
- [ ] Verify on testnet

### Phase 5: Deployment

- [ ] Update environment variables
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Monitor for errors
- [ ] Deploy to production

## Common Issues

### Issue 1: Module Not Found

**Error:**
```
Cannot find module '@fhevm/sdk'
```

**Solution:**
```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
```

### Issue 2: TypeScript Errors

**Error:**
```
Property 'encrypt' does not exist on type 'FhevmInstance'
```

**Solution:**
Use the correct function names:
```typescript
// Wrong
fhevm.encrypt(42)

// Correct
import { encryptInput } from '@fhevm/sdk'
encryptInput(42, fhevm)
```

### Issue 3: React Hook Errors

**Error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component
```

**Solution:**
Ensure you're using hooks inside a component wrapped with `FhevmProvider`:
```typescript
<FhevmProvider config={config}>
  <YourComponent />
</FhevmProvider>
```

### Issue 4: Network Configuration

**Error:**
```
Unsupported network: undefined
```

**Solution:**
Specify network in configuration:
```typescript
const config = {
  network: 'sepolia',  // Don't forget this!
  contractAddress: '0x...'
}
```

### Issue 5: Missing Contract Address

**Error:**
```
Contract address is required
```

**Solution:**
Provide contract address in config or options:
```typescript
const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'  // Add this
})
```

## Step-by-Step Migration

### Step 1: Update Package Dependencies

```json
// package.json
{
  "dependencies": {
    // Remove old packages
    // "fhevmjs": "^0.3.0",

    // Add new package
    "@fhevm/sdk": "^1.0.0",
    "ethers": "^6.9.0"
  }
}
```

### Step 2: Update Initialization

**Before:**
```typescript
// src/utils/fhevm.ts
import { createInstance } from 'fhevmjs'

export async function getFhevm() {
  return await createInstance({
    chainId: 11155111
  })
}
```

**After:**
```typescript
// src/utils/fhevm.ts
import { initFhevm } from '@fhevm/sdk'

export async function getFhevm() {
  return await initFhevm({
    network: 'sepolia',
    contractAddress: process.env.CONTRACT_ADDRESS
  })
}
```

### Step 3: Update React Components

**Before:**
```typescript
import { useEffect, useState } from 'react'
import { createInstance } from 'fhevmjs'

function App() {
  const [fhevm, setFhevm] = useState(null)

  useEffect(() => {
    createInstance({ chainId: 11155111 }).then(setFhevm)
  }, [])

  return fhevm ? <Main fhevm={fhevm} /> : <Loading />
}
```

**After:**
```typescript
import { FhevmProvider, useFhevm } from '@fhevm/sdk/react'

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <Main />
    </FhevmProvider>
  )
}

function Main() {
  const { fhevm, isInitialized } = useFhevm()
  return isInitialized ? <Content /> : <Loading />
}
```

### Step 4: Update Encryption Code

Find and replace all encryption calls:

```bash
# Find all occurrences
grep -r "encrypt8\|encrypt16\|encrypt32" src/

# Update manually or with sed
```

### Step 5: Test Everything

```bash
npm test
npm run build
npm start
```

## Performance Considerations

### Bundle Size Comparison

- **fhevmjs**: ~500KB
- **Universal FHEVM SDK**: ~200KB (60% smaller)

### Optimization Tips

1. **Use dynamic imports** for client-only code
2. **Cache FHEVM instance** to avoid re-initialization
3. **Batch encrypt** multiple values when possible
4. **Use appropriate data types** (uint8 vs uint256)

## Getting Help

If you encounter issues during migration:

1. Check the [API Reference](./api-reference.md)
2. Review [examples](../examples/)
3. Search [GitHub Issues](https://github.com/TysonDouglas/fhevm-react-template/issues)
4. Ask in [GitHub Discussions](https://github.com/TysonDouglas/fhevm-react-template/discussions)

## Next Steps

- [Getting Started](./getting-started.md) - New project setup
- [API Reference](./api-reference.md) - Complete API
- [Best Practices](./best-practices.md) - Tips and patterns
