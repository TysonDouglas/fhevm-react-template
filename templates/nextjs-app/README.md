# FHEVM Next.js Example

Full-featured Next.js application demonstrating FHEVM SDK integration with server-side rendering, API routes, and optimized performance.

## Features

- ✅ Server-side rendering (SSR)
- ✅ API routes for backend encryption
- ✅ FHEVM SDK React hooks
- ✅ TypeScript support
- ✅ Production-ready configuration
- ✅ Optimized performance

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
├── pages/
│   ├── api/              # API routes
│   │   ├── encrypt.ts    # Server-side encryption
│   │   └── decrypt.ts    # Server-side decryption
│   ├── _app.tsx          # App wrapper with FHEVM Provider
│   └── index.tsx         # Home page
├── components/           # React components
│   ├── EncryptForm.tsx
│   └── DecryptForm.tsx
├── lib/                  # Utilities
│   └── fhevm.ts
└── public/               # Static assets
```

## Usage

### 1. Provider Setup

```typescript
// pages/_app.tsx
import { FhevmProvider } from '@fhevm/sdk/react'

export default function App({ Component, pageProps }) {
  const fhevmConfig = {
    network: 'sepolia',
    contractAddress: '0x...'
  }

  return (
    <FhevmProvider config={fhevmConfig}>
      <Component {...pageProps} />
    </FhevmProvider>
  )
}
```

### 2. Client-side Encryption

```typescript
// components/EncryptForm.tsx
import { useEncrypt } from '@fhevm/sdk/react'

export function EncryptForm() {
  const { encrypt, isEncrypting } = useEncrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value)
    console.log('Encrypted:', encrypted)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 3. Server-side API

```typescript
// pages/api/encrypt.ts
import { encryptInput, initFhevm } from '@fhevm/sdk'

export default async function handler(req, res) {
  const fhevm = await initFhevm({
    network: 'sepolia'
  })

  const encrypted = await encryptInput(req.body.value, fhevm)
  res.json({ encrypted })
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
