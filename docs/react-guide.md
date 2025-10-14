# React Integration Guide

Complete guide for using FHEVM SDK in React applications.

## Table of Contents

- [Installation](#installation)
- [Provider Setup](#provider-setup)
- [Hooks Reference](#hooks-reference)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Installation

Install the FHEVM SDK in your React project:

```bash
npm install @fhevm/sdk ethers
```

Or with yarn:

```bash
yarn add @fhevm/sdk ethers
```

## Provider Setup

### Basic Setup

Wrap your application with the `FhevmProvider`:

```tsx
import React from 'react'
import { FhevmProvider } from '@fhevm/sdk/react'

function App() {
  const config = {
    network: 'sepolia',
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS
  }

  return (
    <FhevmProvider config={config}>
      <YourApp />
    </FhevmProvider>
  )
}

export default App
```

### Advanced Configuration

```tsx
import { FhevmProvider } from '@fhevm/sdk/react'
import { ethers } from 'ethers'

function App() {
  const [provider, setProvider] = React.useState(null)

  React.useEffect(() => {
    if (window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(ethersProvider)
    }
  }, [])

  const config = {
    network: 'sepolia',
    provider: provider,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS
  }

  if (!provider) {
    return <div>Loading Web3 Provider...</div>
  }

  return (
    <FhevmProvider config={config}>
      <YourApp />
    </FhevmProvider>
  )
}
```

## Hooks Reference

### `useFhevm()`

Access the FHEVM instance and initialization status.

```tsx
import { useFhevm } from '@fhevm/sdk/react'

function MyComponent() {
  const { fhevm, isInitialized, error, init } = useFhevm()

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!isInitialized) {
    return <div>Initializing FHEVM...</div>
  }

  return (
    <div>
      <p>Network: {fhevm.network}</p>
      <p>Chain ID: {fhevm.networkConfig.chainId}</p>
    </div>
  )
}
```

**Returns:**
```typescript
{
  fhevm: FhevmInstance | null
  isInitialized: boolean
  error: Error | null
  init: (config: FhevmConfig) => Promise<void>
}
```

---

### `useEncrypt()`

Encrypt data with loading states and error handling.

```tsx
import { useEncrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

function EncryptForm() {
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const encrypted = await encrypt(parseInt(value), { type: 'uint8' })
      setResult(encrypted)
    } catch (err) {
      console.error('Encryption failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isEncrypting}
      />
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {error && <div className="error">{error.message}</div>}
      {result && <div>Handle: {result.handle}</div>}
    </form>
  )
}
```

**Returns:**
```typescript
{
  encrypt: (value: number | bigint, options?: EncryptOptions) => Promise<EncryptedValue>
  isEncrypting: boolean
  error: Error | null
}
```

---

### `useDecrypt()`

Decrypt encrypted values with user signature or public decryption.

```tsx
import { useDecrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

function DecryptComponent({ encryptedHandle, contractAddress }) {
  const { userDecrypt, publicDecrypt, isDecrypting, error } = useDecrypt()
  const [decryptedValue, setDecryptedValue] = useState(null)
  const userAddress = '0x...' // Get from wallet

  const handleUserDecrypt = async () => {
    try {
      const result = await userDecrypt(
        encryptedHandle,
        contractAddress,
        { userAddress }
      )
      setDecryptedValue(result.value)
    } catch (err) {
      console.error('Decryption failed:', err)
    }
  }

  const handlePublicDecrypt = async () => {
    try {
      const result = await publicDecrypt(encryptedHandle)
      setDecryptedValue(result.value)
    } catch (err) {
      console.error('Public decryption failed:', err)
    }
  }

  return (
    <div>
      <button onClick={handleUserDecrypt} disabled={isDecrypting}>
        User Decrypt
      </button>
      <button onClick={handlePublicDecrypt} disabled={isDecrypting}>
        Public Decrypt
      </button>

      {isDecrypting && <div>Decrypting...</div>}
      {error && <div className="error">{error.message}</div>}
      {decryptedValue !== null && <div>Value: {decryptedValue}</div>}
    </div>
  )
}
```

**Returns:**
```typescript
{
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

---

### `useFhevmContract()`

Interact with FHE-enabled smart contracts.

```tsx
import { useFhevmContract } from '@fhevm/sdk/react'
import contractAbi from './abi.json'

function ContractComponent() {
  const { contract, call, send, isLoading, error } = useFhevmContract({
    address: '0x...',
    abi: contractAbi
  })

  const readData = async () => {
    const data = await call('getData')
    console.log('Data:', data)
  }

  const submitData = async (encryptedValue, proof) => {
    const tx = await send('submitData', encryptedValue, proof)
    console.log('Transaction:', tx)
  }

  return (
    <div>
      <button onClick={readData} disabled={isLoading}>
        Read Data
      </button>
      {error && <div className="error">{error.message}</div>}
    </div>
  )
}
```

**Returns:**
```typescript
{
  contract: { address: string; abi: any[] }
  call: (method: string, ...args: any[]) => Promise<any>
  send: (method: string, ...args: any[]) => Promise<any>
  isLoading: boolean
  error: Error | null
}
```

## Component Patterns

### Encryption Form Component

```tsx
import { useEncrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

export function EncryptionForm({ onEncrypted }) {
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [formData, setFormData] = useState({
    value: '',
    type: 'uint8'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const encrypted = await encrypt(
      parseInt(formData.value),
      { type: formData.type }
    )

    onEncrypted(encrypted)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Value:</label>
        <input
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="uint8">uint8</option>
          <option value="uint16">uint16</option>
          <option value="uint32">uint32</option>
          <option value="uint64">uint64</option>
        </select>
      </div>

      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {error && <div className="error">{error.message}</div>}
    </form>
  )
}
```

### Batch Encryption Component

```tsx
import { useFhevm } from '@fhevm/sdk/react'
import { createEncryptedInput } from '@fhevm/sdk'
import { useState } from 'react'

export function BatchEncryptForm({ userAddress, onEncrypted }) {
  const { fhevm } = useFhevm()
  const [values, setValues] = useState({
    value1: '',
    value2: '',
    value3: ''
  })
  const [isEncrypting, setIsEncrypting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsEncrypting(true)

    try {
      const encrypted = await createEncryptedInput(fhevm, userAddress)
        .add8(parseInt(values.value1))
        .add16(parseInt(values.value2))
        .add32(parseInt(values.value3))
        .encrypt()

      onEncrypted(encrypted)
    } catch (error) {
      console.error('Batch encryption failed:', error)
    } finally {
      setIsEncrypting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={values.value1}
        onChange={(e) => setValues({ ...values, value1: e.target.value })}
        placeholder="Value 1 (uint8)"
      />
      <input
        type="number"
        value={values.value2}
        onChange={(e) => setValues({ ...values, value2: e.target.value })}
        placeholder="Value 2 (uint16)"
      />
      <input
        type="number"
        value={values.value3}
        onChange={(e) => setValues({ ...values, value3: e.target.value })}
        placeholder="Value 3 (uint32)"
      />

      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt All'}
      </button>
    </form>
  )
}
```

### Conditional Rendering Based on Initialization

```tsx
import { useFhevm } from '@fhevm/sdk/react'

export function FhevmStatus({ children }) {
  const { isInitialized, error } = useFhevm()

  if (error) {
    return (
      <div className="error-container">
        <h2>FHEVM Initialization Error</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Initializing FHEVM...</p>
      </div>
    )
  }

  return <>{children}</>
}

// Usage
function App() {
  return (
    <FhevmProvider config={config}>
      <FhevmStatus>
        <YourComponents />
      </FhevmStatus>
    </FhevmProvider>
  )
}
```

## State Management

### Using Context with FHEVM

```tsx
import { createContext, useContext, useState } from 'react'
import { useFhevm, useEncrypt } from '@fhevm/sdk/react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const { fhevm, isInitialized } = useFhevm()
  const { encrypt } = useEncrypt()
  const [encryptedData, setEncryptedData] = useState([])

  const addEncryptedData = async (value) => {
    const encrypted = await encrypt(value)
    setEncryptedData([...encryptedData, encrypted])
  }

  return (
    <AppContext.Provider
      value={{
        fhevm,
        isInitialized,
        encryptedData,
        addEncryptedData
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
```

### With Redux

```tsx
// store/fhevmSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const encryptValue = createAsyncThunk(
  'fhevm/encrypt',
  async ({ encrypt, value, options }) => {
    const result = await encrypt(value, options)
    return result
  }
)

const fhevmSlice = createSlice({
  name: 'fhevm',
  initialState: {
    encryptedValues: [],
    isEncrypting: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(encryptValue.pending, (state) => {
        state.isEncrypting = true
      })
      .addCase(encryptValue.fulfilled, (state, action) => {
        state.isEncrypting = false
        state.encryptedValues.push(action.payload)
      })
      .addCase(encryptValue.rejected, (state, action) => {
        state.isEncrypting = false
        state.error = action.error.message
      })
  }
})

export default fhevmSlice.reducer

// Component
import { useDispatch, useSelector } from 'react-redux'
import { useEncrypt } from '@fhevm/sdk/react'
import { encryptValue } from './store/fhevmSlice'

function EncryptComponent() {
  const dispatch = useDispatch()
  const { encrypt } = useEncrypt()
  const { encryptedValues, isEncrypting } = useSelector(state => state.fhevm)

  const handleEncrypt = (value) => {
    dispatch(encryptValue({ encrypt, value, options: { type: 'uint8' } }))
  }

  return <div>...</div>
}
```

## Error Handling

### Comprehensive Error Handling

```tsx
import { useEncrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

function EncryptWithErrorHandling() {
  const { encrypt, isEncrypting, error: hookError } = useEncrypt()
  const [localError, setLocalError] = useState(null)

  const handleEncrypt = async (value) => {
    setLocalError(null)

    try {
      // Validate input
      if (value < 0 || value > 255) {
        throw new Error('Value must be between 0 and 255 for uint8')
      }

      const encrypted = await encrypt(value, { type: 'uint8' })

      // Success handling
      console.log('Encryption successful:', encrypted)

    } catch (error) {
      // Error categorization
      if (error.message.includes('FHEVM not initialized')) {
        setLocalError('Please wait for FHEVM to initialize')
      } else if (error.code === 4001) {
        setLocalError('User rejected the request')
      } else if (error.message.includes('Invalid value')) {
        setLocalError('Invalid input value')
      } else {
        setLocalError('Encryption failed. Please try again.')
      }

      console.error('Encryption error:', error)
    }
  }

  const displayError = localError || hookError?.message

  return (
    <div>
      {/* Component UI */}
      {displayError && (
        <div className="error-banner">
          {displayError}
        </div>
      )}
    </div>
  )
}
```

## Best Practices

### 1. Memoize FHEVM Configuration

```tsx
import { useMemo } from 'react'
import { FhevmProvider } from '@fhevm/sdk/react'

function App() {
  const config = useMemo(() => ({
    network: process.env.REACT_APP_NETWORK,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS
  }), [])

  return (
    <FhevmProvider config={config}>
      <YourApp />
    </FhevmProvider>
  )
}
```

### 2. Use Loading States

```tsx
function EncryptButton({ value }) {
  const { encrypt, isEncrypting } = useEncrypt()

  return (
    <button onClick={() => encrypt(value)} disabled={isEncrypting}>
      {isEncrypting ? (
        <>
          <Spinner />
          <span>Encrypting...</span>
        </>
      ) : (
        'Encrypt'
      )}
    </button>
  )
}
```

### 3. Cleanup and Cancellation

```tsx
import { useEffect, useRef } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'

function EncryptComponent() {
  const { encrypt } = useEncrypt()
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleEncrypt = async (value) => {
    const encrypted = await encrypt(value)

    // Only update state if component is still mounted
    if (isMounted.current) {
      // Update state...
    }
  }

  return <div>...</div>
}
```

### 4. TypeScript Integration

```tsx
import { FC } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'
import type { EncryptedValue } from '@fhevm/sdk'

interface EncryptFormProps {
  onEncrypted: (encrypted: EncryptedValue) => void
}

export const EncryptForm: FC<EncryptFormProps> = ({ onEncrypted }) => {
  const { encrypt, isEncrypting, error } = useEncrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, { type: 'uint8' })
    onEncrypted(encrypted)
  }

  return <div>...</div>
}
```

## Performance Optimization

### Lazy Loading Components

```tsx
import { lazy, Suspense } from 'react'

const EncryptComponent = lazy(() => import('./EncryptComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EncryptComponent />
    </Suspense>
  )
}
```

### Debouncing Encryption

```tsx
import { useState, useCallback } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'
import { debounce } from 'lodash'

function DebouncedEncrypt() {
  const { encrypt } = useEncrypt()
  const [result, setResult] = useState(null)

  const debouncedEncrypt = useCallback(
    debounce(async (value) => {
      const encrypted = await encrypt(value)
      setResult(encrypted)
    }, 500),
    [encrypt]
  )

  return (
    <input
      type="number"
      onChange={(e) => debouncedEncrypt(parseInt(e.target.value))}
    />
  )
}
```

## Testing

### Testing Components with FHEVM

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { FhevmProvider } from '@fhevm/sdk/react'
import EncryptComponent from './EncryptComponent'

const mockConfig = {
  network: 'localhost',
  contractAddress: '0x...'
}

describe('EncryptComponent', () => {
  it('should encrypt value', async () => {
    render(
      <FhevmProvider config={mockConfig}>
        <EncryptComponent />
      </FhevmProvider>
    )

    const input = screen.getByPlaceholderText('Enter value')
    const button = screen.getByText('Encrypt')

    fireEvent.change(input, { target: { value: '42' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Encrypted/)).toBeInTheDocument()
    })
  })
})
```

## Next Steps

- [Next.js Guide](./nextjs-guide.md) - Server-side rendering
- [API Reference](./api-reference.md) - Complete API docs
- [Best Practices](./best-practices.md) - Tips and patterns
