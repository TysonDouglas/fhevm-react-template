# FHEVM Next.js App Router Example

Full-featured Next.js 14 application with App Router demonstrating complete FHEVM SDK integration, featuring server-side rendering, API routes, and optimized performance.

## Features

- ✅ Next.js 14 App Router architecture
- ✅ Server-side rendering (SSR) and client components
- ✅ API routes for FHE operations (encrypt, decrypt, compute, keys)
- ✅ FHEVM SDK React hooks integration
- ✅ Modular component structure (UI + FHE components)
- ✅ TypeScript support with path aliases
- ✅ Production-ready configuration
- ✅ Optimized performance and bundle size

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Structure

```
nextjs-app/
├── src/
│   ├── app/                      # App Router (Next.js 14)
│   │   ├── layout.tsx            # Root layout with FHE provider
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   └── api/                  # API routes
│   │       ├── fhe/
│   │       │   ├── route.ts      # Main FHE operations
│   │       │   ├── encrypt/route.ts
│   │       │   ├── decrypt/route.ts
│   │       │   └── compute/route.ts
│   │       └── keys/route.ts     # Key management
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── fhe/                  # FHE-specific components
│   │       ├── EncryptionDemo.tsx
│   │       ├── ComputationDemo.tsx
│   │       └── KeyManager.tsx
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── fhe/                  # FHE operations
│   │   │   ├── client.ts         # Client-side utilities
│   │   │   ├── server.ts         # Server-side utilities
│   │   │   ├── keys.ts           # Key management
│   │   │   └── types.ts          # FHE type definitions
│   │   └── utils/                # Helper functions
│   │       ├── security.ts
│   │       └── validation.ts
│   │
│   └── types/                    # TypeScript types
│       ├── fhe.ts
│       └── api.ts
│
├── package.json
├── tsconfig.json
└── next.config.js
```

## Usage

### 1. Provider Setup (App Router)

```typescript
// src/app/layout.tsx
import { FhevmProvider } from '@fhevm/sdk/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fhevmConfig = {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  }

  return (
    <html lang="en">
      <body>
        <FhevmProvider config={fhevmConfig}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  )
}
```

### 2. Client-side Encryption

```typescript
// src/components/fhe/EncryptionDemo.tsx
'use client'  // Required for client components in App Router

import { useEncrypt } from '@fhevm/sdk/react'
import Button from '@/components/ui/Button'

export default function EncryptionDemo() {
  const { encrypt, isEncrypting } = useEncrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, { type: 'uint32' })
    console.log('Encrypted:', encrypted)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button variant="primary" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </Button>
    </form>
  )
}
```

### 3. Server-side API Routes

```typescript
// src/app/api/fhe/encrypt/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { encryptInput, initFhevm } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  const { value, type } = await request.json()

  const fhevm = await initFhevm({
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  })

  const encrypted = await encryptInput(value, fhevm, { type })

  return NextResponse.json({
    success: true,
    data: { encrypted, timestamp: Date.now() }
  })
}
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=sepolia
```

## Best Practices

1. **Use Server-side for Sensitive Operations**
   - Keep private keys on server
   - Use API routes for encryption with secrets

2. **Optimize Performance**
   - Use dynamic imports for heavy components
   - Implement caching strategies
   - Minimize client-side bundle

3. **Error Handling**
   - Wrap async operations in try-catch
   - Show user-friendly error messages
   - Log errors for monitoring

## Examples

See the implementation for complete examples of:
- Encrypted form submissions
- Decryption with EIP-712 signatures
- Contract interactions
- Error handling
- Loading states

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM SDK Documentation](../../docs)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
