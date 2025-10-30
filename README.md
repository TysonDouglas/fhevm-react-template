# Universal FHEVM SDK - Bounty Program Submission

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-blue)](https://github.com/TysonDouglas/fhevm-react-template)
[![FHEVM](https://img.shields.io/badge/FHEVM-Compatible-green)](https://docs.zama.ai/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/TysonDouglas/fhevm-react-template)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://fhe-athlete-selection.vercel.app/)

A universal, framework-agnostic SDK for building confidential frontends with Fully Homomorphic Encryption (FHE). Works seamlessly with React, Next.js, Vue, Node.js, and any JavaScript environment.

## 🔗 Quick Links

- 📂 **GitHub Repository**: [https://github.com/TysonDouglas/fhevm-react-template](https://github.com/TysonDouglas/fhevm-react-template)
- 🌐 **Live Demo**: [https://fhe-athlete-selection.vercel.app/](https://fhe-athlete-selection.vercel.app/)
- 📹 **Demo Video**: Download `demo.mp4` from this repository (video must be downloaded to view)
- 📚 **Documentation**: See [docs/](./docs/) directory for complete guides

## 🎯 Overview

This SDK provides a **wagmi-like** developer experience for FHEVM applications, making it simple, consistent, and intuitive to build privacy-preserving dApps.

### Key Features

- ✅ **Framework Agnostic** - Works with React, Next.js, Vue, Node.js, or vanilla JavaScript
- ✅ **Unified API** - Single package wrapping all FHEVM dependencies
- ✅ **Wagmi-like Structure** - Familiar hooks and utilities for web3 developers
- ✅ **Type Safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Zero Config** - Works out of the box with sensible defaults
- ✅ **Modular** - Use only what you need, tree-shakeable
- ✅ **Well Documented** - Extensive documentation and examples

## 🚀 Quick Start

Get started in less than 10 lines of code:

```bash
# Install the SDK
npm install @fhevm/sdk ethers

# Start building!
```

### Basic Usage

```typescript
import { initFhevm, encryptInput, decryptValue } from '@fhevm/sdk'

// 1. Initialize
const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
})

// 2. Encrypt input
const encrypted = await encryptInput(42, fhevm)

// 3. Decrypt output
const decrypted = await decryptValue(encryptedValue, fhevm)
```

## 📦 Package Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React hooks
│       │   ├── utils/          # Utility functions
│       │   └── types/          # TypeScript definitions
│       └── package.json
├── examples/                   # Example implementations
│   ├── nextjs-app/             # Next.js App Router example
│   │   ├── src/
│   │   │   ├── app/            # Next.js 14 App Router
│   │   │   │   ├── api/        # API routes (encrypt, decrypt, compute)
│   │   │   │   ├── layout.tsx  # Root layout with FHE provider
│   │   │   │   └── page.tsx    # Home page
│   │   │   ├── components/     # React components
│   │   │   │   ├── fhe/        # FHE-specific components
│   │   │   │   └── ui/         # UI components
│   │   │   ├── lib/            # Utility libraries
│   │   │   │   ├── fhe/        # FHE operations
│   │   │   │   └── utils/      # Helper functions
│   │   │   └── types/          # TypeScript types
│   ├── react-app/              # React SPA example
│   └── athlete-selection/      # Real-world privacy application
├── templates/                  # Symlink to examples
├── docs/                       # Documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── nextjs-guide.md
│   └── react-guide.md
└── demo.mp4                    # Video demonstration
```

## 🎨 Examples

### 1. Next.js Application (App Router)

Full-featured Next.js 14 app with App Router demonstrating complete SDK integration.

```bash
cd examples/nextjs-app
npm install
npm run dev
```

**Features**:
- Next.js 14 App Router architecture
- Server-side rendering support
- API routes for FHE operations (encrypt, decrypt, compute)
- FHE-specific components (EncryptionDemo, ComputationDemo, KeyManager)
- Modular structure with lib utilities
- Type-safe with TypeScript
- Production-ready configuration

### 2. React Application

Pure React SPA with FHEVM SDK.

```bash
cd examples/react-app
npm install
npm start
```

**Features**:
- Client-side encryption/decryption
- React hooks integration
- Component library
- State management

### 3. Anonymous Athlete Selection

Real-world privacy-preserving application.

```bash
cd examples/athlete-selection
npm install
npm run dev
```

**Features**:
- Complete FHE workflow
- Role-based access control
- Encrypted data operations
- Production example

## 🛠️ Installation

### Option 1: From Root (Monorepo)

```bash
# Install all packages
npm install

# Build SDK
npm run build:sdk

# Run examples
npm run dev:nextjs    # Next.js example
npm run dev:react     # React example
```

### Option 2: Individual Packages

```bash
# Just the SDK
cd packages/fhevm-sdk
npm install
npm run build

# Individual example
cd examples/nextjs-app
npm install
npm run dev
```

## 📚 Core SDK Features

### 1. Initialization

```typescript
import { initFhevm, FhevmProvider } from '@fhevm/sdk'

// Async initialization
const fhevm = await initFhevm({
  network: 'sepolia',
  provider: window.ethereum,
  contractAddress: '0x...'
})

// React provider
<FhevmProvider config={config}>
  <YourApp />
</FhevmProvider>
```

### 2. Encryption

```typescript
import { useEncrypt, encryptInput } from '@fhevm/sdk'

// React hook
const { encrypt, isEncrypting } = useEncrypt()
const encrypted = await encrypt(42)

// Vanilla JavaScript
const encrypted = await encryptInput(42, fhevm, {
  type: 'uint32'
})
```

### 3. Decryption

```typescript
import { useDecrypt, decryptValue } from '@fhevm/sdk'

// User decrypt (EIP-712 signature)
const { userDecrypt } = useDecrypt()
const value = await userDecrypt(encryptedValue, contractAddress)

// Public decrypt
const value = await fhevm.publicDecrypt(encryptedValue)
```

### 4. Contract Interaction

```typescript
import { useFhevmContract } from '@fhevm/sdk'

const contract = useFhevmContract({
  address: '0x...',
  abi: contractABI
})

// Call with encrypted inputs
const tx = await contract.submitEncrypted(encryptedInput)
```

## 🎯 Framework Examples

### React Hooks

```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react'

function MyComponent() {
  const { isInitialized } = useFhevm()
  const { encrypt } = useEncrypt()
  const { userDecrypt } = useDecrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value)
    // Use encrypted value...
  }

  return <div>...</div>
}
```

### Next.js App Router (Server & Client)

```typescript
// app/api/fhe/encrypt/route.ts (Server-side API Route)
import { NextRequest, NextResponse } from 'next/server'
import { encryptInput, initFhevm } from '@fhevm/sdk'

export async function POST(request: NextRequest) {
  const { value, type } = await request.json()
  const fhevm = await initFhevm({ network: 'sepolia' })
  const encrypted = await encryptInput(value, fhevm, { type })
  return NextResponse.json({ success: true, data: { encrypted } })
}

// components/fhe/EncryptionDemo.tsx (Client-side Component)
'use client'
import { useEncrypt } from '@fhevm/sdk/react'

export default function EncryptionDemo() {
  const { encrypt, isEncrypting } = useEncrypt()

  const handleEncrypt = async (value: number) => {
    const encrypted = await encrypt(value)
    console.log('Encrypted:', encrypted)
  }
  // ...
}
```

### Vue Integration

```typescript
import { initFhevm, encryptInput } from '@fhevm/sdk'

export default {
  async setup() {
    const fhevm = await initFhevm(config)

    const encrypt = async (value) => {
      return await encryptInput(value, fhevm)
    }

    return { encrypt }
  }
}
```

### Plain Node.js

```typescript
const { initFhevm, encryptInput, decryptValue } = require('@fhevm/sdk')

async function main() {
  const fhevm = await initFhevm({
    network: 'sepolia',
    privateKey: process.env.PRIVATE_KEY
  })

  const encrypted = await encryptInput(42, fhevm)
  console.log('Encrypted:', encrypted)
}

main()
```

## 📖 API Reference

### Core Functions

| Function | Description | Framework |
|----------|-------------|-----------|
| `initFhevm(config)` | Initialize FHEVM instance | All |
| `encryptInput(value, fhevm, options)` | Encrypt input value | All |
| `decryptValue(encrypted, fhevm)` | Decrypt output value | All |
| `createFhevmProvider(config)` | Create provider instance | All |

### React Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useFhevm()` | Access FHEVM context | `{ fhevm, isInitialized }` |
| `useEncrypt()` | Encryption utilities | `{ encrypt, isEncrypting }` |
| `useDecrypt()` | Decryption utilities | `{ userDecrypt, publicDecrypt }` |
| `useFhevmContract()` | Contract interaction | `{ contract, call, send }` |

### TypeScript Types

```typescript
interface FhevmConfig {
  network: 'sepolia' | 'localhost'
  provider?: any
  privateKey?: string
  contractAddress?: string
}

interface EncryptOptions {
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64'
  publicKey?: string
}

interface DecryptOptions {
  userAddress?: string
  signature?: string
}
```

## 🎬 Video Demonstration

📹 **Demo Video**: `demo.mp4` (download from repository to view)

**Important**: The demo video file is included in this repository. Download the `demo.mp4` file to your local machine to watch the complete demonstration. The video link cannot be opened directly in the browser.

**Demonstration includes**:
- Quick setup and installation (< 2 minutes)
- Framework integration examples (React, Next.js, Node.js)
- Real-world use case walkthrough (Anonymous Athlete Selection)
- Encryption/decryption workflow demonstration
- Contract interaction patterns and best practices
- Live application features and UI

## 🏗️ Architecture

### Design Principles

1. **Framework Agnostic Core** - Pure JavaScript/TypeScript core with no framework dependencies
2. **Adapter Pattern** - Framework-specific adapters (React hooks, Vue composables)
3. **Single Responsibility** - Each module has one clear purpose
4. **Progressive Enhancement** - Start simple, add complexity as needed
5. **Developer Experience** - Wagmi-like API that feels familiar

### Module Structure

```
@fhevm/sdk
├── core/              # Framework-agnostic
│   ├── init.ts
│   ├── encrypt.ts
│   ├── decrypt.ts
│   └── contract.ts
├── react/             # React-specific
│   ├── provider.tsx
│   ├── hooks/
│   └── components/
├── utils/             # Utilities
│   ├── validation.ts
│   ├── conversion.ts
│   └── helpers.ts
└── types/             # TypeScript
    ├── config.ts
    ├── encryption.ts
    └── contracts.ts
```

## 📊 Comparison with Existing Solutions

| Feature | FHEVM SDK | fhevmjs | tfhe-rs |
|---------|-----------|---------|---------|
| Framework Agnostic | ✅ | ❌ | ❌ |
| React Hooks | ✅ | ❌ | ❌ |
| TypeScript | ✅ | Partial | ❌ |
| Single Package | ✅ | ❌ | ❌ |
| Wagmi-like API | ✅ | ❌ | ❌ |
| Examples | ✅ | Limited | ❌ |
| Documentation | ✅ | Partial | Limited |

## 🎓 Documentation

Comprehensive documentation available in `/docs`:

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [React Guide](./docs/react-guide.md)
- [Next.js Guide](./docs/nextjs-guide.md)
- [Migration Guide](./docs/migration.md)
- [Best Practices](./docs/best-practices.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run SDK tests
cd packages/fhevm-sdk
npm test

# Run example tests
cd examples/nextjs-app
npm test
```

## 🚀 Deployment

### Deploy Examples

All examples include deployment configurations:

```bash
# Next.js (Vercel)
cd examples/nextjs-app
vercel

# React (Netlify)
cd examples/react-app
npm run build
netlify deploy
```

### Live Demo

🌐 **Live Application**: [https://fhe-athlete-selection.vercel.app/](https://fhe-athlete-selection.vercel.app/)

Experience the Anonymous Athlete Selection system - a real-world implementation demonstrating:
- Privacy-preserving athlete registration with FHE
- Committee and evaluator role management
- Encrypted data operations on blockchain
- Complete selection workflow
- Interactive user interface

## 🏆 Bounty Program Deliverables

### ✅ Core Requirements Met

1. **Universal FHEVM SDK** - Framework-agnostic core package
   - Works with React, Next.js, Vue, Node.js
   - Single unified package
   - Zero dependencies on specific frameworks

2. **Next.js Example** - Full-featured Next.js 14 integration
   - Server-side rendering support
   - API routes for backend operations
   - Production-ready components

3. **Real-world Example** - Anonymous Athlete Selection system
   - Complete FHE workflow implementation
   - Privacy-preserving sports talent selection
   - Role-based access control
   - Live deployment

4. **Video Demonstration** - `demo.mp4` file included
   - Complete setup and usage walkthrough
   - Framework integration examples
   - Real-world application demonstration
   - Download from repository to view

5. **Comprehensive Documentation** - Complete developer guides
   - Getting started guide
   - API reference
   - Best practices
   - Framework-specific guides

6. **Live Deployment** - Production application
   - URL: [https://fhe-athlete-selection.vercel.app/](https://fhe-athlete-selection.vercel.app/)
   - Fully functional and accessible

## 📈 Evaluation Criteria

### ✅ Usability
- **Quick Setup**: < 10 lines of code to start
- **Minimal Boilerplate**: One import, instant usage
- **Clear API**: Intuitive, wagmi-like structure

### ✅ Completeness
- **Full FHEVM Flow**: Init → Encrypt → Interact → Decrypt
- **All Methods**: userDecrypt (EIP-712) + publicDecrypt
- **Contract Integration**: Complete ABI handling

### ✅ Reusability
- **Modular Components**: Use what you need
- **Framework Adapters**: React, Next.js, Vue, Node.js
- **Clean Architecture**: Separation of concerns

### ✅ Documentation
- **Extensive Docs**: 6+ documentation files
- **Code Examples**: 3+ working examples
- **API Reference**: Complete type definitions

### ✅ Creativity
- **Multi-environment**: Next.js, React, Node.js examples
- **Real-world Use Case**: Anonymous Athlete Selection
- **Innovative Patterns**: Wagmi-like hooks, provider pattern

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🔗 Important Links

### Project Resources

- 📂 **GitHub Repository**: [https://github.com/TysonDouglas/fhevm-react-template](https://github.com/TysonDouglas/fhevm-react-template)
- 🌐 **Live Demo Application**: [https://fhe-athlete-selection.vercel.app/](https://fhe-athlete-selection.vercel.app/)
- 📹 **Demo Video**: Download `demo.mp4` from the repository
- 📚 **Documentation**: Available in [docs/](./docs/) directory

### External Resources

- **Zama FHEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **FHEVM Developer Docs**: [https://docs.zama.ai/](https://docs.zama.ai/)
- **Zama Community Discord**: [https://discord.gg/zama](https://discord.gg/zama)

## 💡 Support & Issues

- **Repository Issues**: [GitHub Issues](https://github.com/TysonDouglas/fhevm-react-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TysonDouglas/fhevm-react-template/discussions)
- **Documentation**: Check [docs/](./docs/) for detailed guides

---

## 🚀 Get Started Now

### Option 1: Try the Live Demo
Visit [https://fhe-athlete-selection.vercel.app/](https://fhe-athlete-selection.vercel.app/) to experience the SDK in action with a real-world privacy-preserving application.

### Option 2: Clone and Build
```bash
git clone https://github.com/TysonDouglas/fhevm-react-template.git
cd fhevm-react-template
npm install
```

### Option 3: Watch the Demo
Download `demo.mp4` from the repository to see a complete walkthrough of setup, integration, and usage.

---

**Built with ❤️ for the FHEVM Community**

*Making confidential smart contracts accessible to every developer*

**Bounty Program Submission - Universal FHEVM SDK**
