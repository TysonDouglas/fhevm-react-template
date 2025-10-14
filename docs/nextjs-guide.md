# Next.js Integration Guide

Complete guide for integrating FHEVM SDK with Next.js applications.

## Table of Contents

- [Installation](#installation)
- [App Router vs Pages Router](#app-router-vs-pages-router)
- [Provider Setup](#provider-setup)
- [Server-Side Operations](#server-side-operations)
- [API Routes](#api-routes)
- [Client Components](#client-components)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## Installation

```bash
npm install @fhevm/sdk ethers next react react-dom
```

Or with yarn:

```bash
yarn add @fhevm/sdk ethers next react react-dom
```

## App Router vs Pages Router

This guide covers both Next.js routing approaches.

### Pages Router (Recommended for FHEVM)

Traditional Next.js routing with `pages/` directory.

### App Router

New Next.js 13+ routing with `app/` directory. Note: FHEVM SDK hooks work in client components only.

## Provider Setup

### Pages Router

#### `pages/_app.tsx`

```tsx
import type { AppProps } from 'next/app'
import { FhevmProvider } from '@fhevm/sdk/react'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const config = {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  }

  return (
    <FhevmProvider config={config}>
      <Component {...pageProps} />
    </FhevmProvider>
  )
}
```

### App Router

#### `app/providers.tsx`

```tsx
'use client'

import { FhevmProvider } from '@fhevm/sdk/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const config = {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  }

  return (
    <FhevmProvider config={config}>
      {children}
    </FhevmProvider>
  )
}
```

#### `app/layout.tsx`

```tsx
import { Providers } from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

## Server-Side Operations

### Server-Side Encryption

#### Pages Router: `getServerSideProps`

```tsx
import { initFhevm, encryptInput } from '@fhevm/sdk'
import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Initialize FHEVM on server
  const fhevm = await initFhevm({
    network: process.env.NETWORK || 'sepolia',
    privateKey: process.env.PRIVATE_KEY
  })

  // Encrypt data server-side
  const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })

  return {
    props: {
      encryptedData: {
        handle: encrypted.handle,
        inputProof: encrypted.inputProof
      }
    }
  }
}

export default function Page({ encryptedData }) {
  return (
    <div>
      <h1>Server-Side Encrypted Data</h1>
      <p>Handle: {encryptedData.handle}</p>
    </div>
  )
}
```

### App Router: Server Components

```tsx
import { initFhevm, encryptInput } from '@fhevm/sdk'

async function getEncryptedData() {
  const fhevm = await initFhevm({
    network: process.env.NETWORK || 'sepolia',
    privateKey: process.env.PRIVATE_KEY
  })

  const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })

  return {
    handle: encrypted.handle,
    inputProof: encrypted.inputProof
  }
}

export default async function Page() {
  const encryptedData = await getEncryptedData()

  return (
    <div>
      <h1>Server-Side Encrypted Data</h1>
      <p>Handle: {encryptedData.handle}</p>
    </div>
  )
}
```

## API Routes

### Pages Router

#### `pages/api/encrypt.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { initFhevm, encryptInput } from '@fhevm/sdk'

type EncryptRequest = {
  value: number
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64'
}

type EncryptResponse = {
  success: boolean
  encrypted?: {
    handle: string
    inputProof: string
    type: string
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EncryptResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { value, type = 'uint8' }: EncryptRequest = req.body

    // Initialize FHEVM
    const fhevm = await initFhevm({
      network: process.env.NETWORK || 'sepolia',
      contractAddress: process.env.CONTRACT_ADDRESS
    })

    // Encrypt value
    const encrypted = await encryptInput(value, fhevm, { type })

    res.status(200).json({
      success: true,
      encrypted: {
        handle: encrypted.handle,
        inputProof: encrypted.inputProof,
        type: encrypted.type
      }
    })
  } catch (error) {
    console.error('Encryption error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    })
  }
}
```

#### `pages/api/decrypt.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { initFhevm, decryptValue } from '@fhevm/sdk'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { encryptedValue, contractAddress, userAddress } = req.body

    const fhevm = await initFhevm({
      network: process.env.NETWORK || 'sepolia'
    })

    const decrypted = await decryptValue(encryptedValue, fhevm, {
      contractAddress,
      userAddress
    })

    res.status(200).json({
      success: true,
      decrypted: {
        value: decrypted.value,
        type: decrypted.type
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed'
    })
  }
}
```

### App Router

#### `app/api/encrypt/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { initFhevm, encryptInput } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint8' } = await request.json()

    const fhevm = await initFhevm({
      network: process.env.NETWORK || 'sepolia',
      contractAddress: process.env.CONTRACT_ADDRESS
    })

    const encrypted = await encryptInput(value, fhevm, { type })

    return NextResponse.json({
      success: true,
      encrypted: {
        handle: encrypted.handle,
        inputProof: encrypted.inputProof,
        type: encrypted.type
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed'
      },
      { status: 500 }
    )
  }
}
```

## Client Components

### Using Hooks in Client Components

```tsx
'use client'

import { useEncrypt, useDecrypt } from '@fhevm/sdk/react'
import { useState } from 'react'

export default function EncryptForm() {
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
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
        placeholder="Enter value"
      />
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {error && <div className="error">{error.message}</div>}
      {result && (
        <div>
          <p>Handle: {result.handle}</p>
          <p>Type: {result.type}</p>
        </div>
      )}
    </form>
  )
}
```

### Calling API Routes from Client

```tsx
'use client'

import { useState } from 'react'

export default function ServerEncrypt() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEncrypt = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseInt(value), type: 'uint8' })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.encrypted)
      } else {
        console.error('Encryption failed:', data.error)
      }
    } catch (error) {
      console.error('Request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleEncrypt} disabled={isLoading}>
        {isLoading ? 'Encrypting...' : 'Encrypt on Server'}
      </button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
```

## Environment Variables

### `.env.local`

```env
# Public variables (accessible in browser)
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Private variables (server-side only)
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x...
NETWORK=sepolia
```

### Usage

```tsx
// Client-side (browser)
const network = process.env.NEXT_PUBLIC_NETWORK

// Server-side only
const privateKey = process.env.PRIVATE_KEY
```

### Environment Variable Types

Create `env.d.ts` in your project root:

```typescript
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_NETWORK: string
    NEXT_PUBLIC_CONTRACT_ADDRESS: string
    PRIVATE_KEY: string
    CONTRACT_ADDRESS: string
    NETWORK: string
  }
}
```

## Middleware

### Rate Limiting for API Routes

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown'
    const now = Date.now()
    const windowMs = 60000 // 1 minute
    const maxRequests = 10

    const requestLog = rateLimit.get(ip) || []
    const recentRequests = requestLog.filter(
      (timestamp: number) => now - timestamp < windowMs
    )

    if (recentRequests.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    recentRequests.push(now)
    rateLimit.set(ip, recentRequests)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

## Optimization

### Caching FHEVM Instance

```typescript
// lib/fhevm.ts
import { initFhevm } from '@fhevm/sdk'
import type { FhevmInstance } from '@fhevm/sdk'

let cachedFhevm: FhevmInstance | null = null

export async function getFhevm() {
  if (cachedFhevm) {
    return cachedFhevm
  }

  cachedFhevm = await initFhevm({
    network: process.env.NETWORK || 'sepolia',
    contractAddress: process.env.CONTRACT_ADDRESS
  })

  return cachedFhevm
}

// Usage in API route
import { getFhevm } from '@/lib/fhevm'

export default async function handler(req, res) {
  const fhevm = await getFhevm() // Uses cached instance
  // ...
}
```

### Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

const EncryptComponent = dynamic(
  () => import('@/components/EncryptComponent'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false // Disable SSR for client-only components
  }
)

export default function Page() {
  return <EncryptComponent />
}
```

## Deployment

### Vercel

#### Install Vercel CLI

```bash
npm i -g vercel
```

#### Deploy

```bash
vercel
```

#### Environment Variables

Set in Vercel dashboard or CLI:

```bash
vercel env add NEXT_PUBLIC_NETWORK
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add PRIVATE_KEY
```

### Configuration

#### `vercel.json`

```json
{
  "env": {
    "NEXT_PUBLIC_NETWORK": "sepolia"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_NETWORK": "sepolia"
    }
  }
}
```

### Docker

#### `Dockerfile`

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### Build and Run

```bash
docker build -t fhevm-nextjs .
docker run -p 3000:3000 -e NEXT_PUBLIC_NETWORK=sepolia fhevm-nextjs
```

## Error Handling

### Custom Error Page

#### `pages/_error.tsx`

```tsx
import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

### API Error Handling

```typescript
// lib/apiError.ts
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

// Usage in API route
import { ApiError } from '@/lib/apiError'

export default async function handler(req, res) {
  try {
    // ... your code
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

## Testing

### API Route Testing

```typescript
// __tests__/api/encrypt.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/encrypt'

describe('/api/encrypt', () => {
  it('should encrypt value', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        value: 42,
        type: 'uint8'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.encrypted).toHaveProperty('handle')
  })
})
```

## Best Practices

1. **Use environment variables** for configuration
2. **Cache FHEVM instance** on server-side
3. **Implement rate limiting** for API routes
4. **Handle errors gracefully** with proper status codes
5. **Use TypeScript** for type safety
6. **Optimize images** with Next.js Image component
7. **Enable compression** in production
8. **Monitor performance** with analytics

## Next Steps

- [React Guide](./react-guide.md) - Client-side patterns
- [API Reference](./api-reference.md) - Complete API
- [Best Practices](./best-practices.md) - Tips and patterns
