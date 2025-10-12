# Anonymous Athlete Selection - FHEVM Example

Real-world privacy-preserving application demonstrating complete FHEVM workflow with SDK integration.

## Overview

This example showcases a production-ready anonymous athlete selection system using Fully Homomorphic Encryption (FHE) to protect sensitive athlete data while enabling fair evaluation processes.

## Features

- ✅ **Privacy-Preserving**: All athlete data encrypted using FHE
- ✅ **Role-Based Access**: Committee, evaluators, and athletes
- ✅ **Complete Workflow**: Registration → Evaluation → Selection
- ✅ **FHEVM SDK Integration**: Uses @fhevm/sdk for all operations
- ✅ **Smart Contract**: Production-ready Solidity contract
- ✅ **Frontend**: React integration with SDK hooks

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run deploy.js --network sepolia

# Start frontend
npm run dev
```

## Architecture

```
Athlete Input (Performance, Fitness, Experience, Age)
           ↓
    FHE Encryption (@fhevm/sdk)
           ↓
    Smart Contract (Encrypted Storage)
           ↓
    Evaluator Assessment (On Encrypted Data)
           ↓
    Selection Results (Privacy Preserved)
```

## SDK Integration

### 1. Initialize SDK

```typescript
import { initFhevm } from '@fhevm/sdk'

const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: ATHLETE_CONTRACT_ADDRESS
})
```

### 2. Encrypt Athlete Data

```typescript
import { createEncryptedInput } from '@fhevm/sdk'

const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(performanceScore)  // 0-100
  .add8(fitnessLevel)      // 0-100
  .add8(experienceYears)   // Years
  .add32(age)              // Age
  .encrypt()

// Submit to contract
await contract.registerAthlete(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.handles[3],
  encrypted.inputProof
)
```

### 3. Decrypt Results

```typescript
import { userDecrypt } from '@fhevm/sdk'

// User-specific decryption with EIP-712 signature
const decrypted = await userDecrypt(
  encryptedResult,
  contractAddress,
  { userAddress }
)
```

## Smart Contract

### Key Functions

```solidity
// Committee functions
function startNewSelection(...) external onlyCommittee
function addAuthorizedEvaluator(address evaluator) external onlyCommittee
function finalizeSelection() external onlyCommittee

// Athlete functions
function registerAthlete(
    euint8 performanceScore,
    euint8 fitnessLevel,
    euint8 experienceYears,
    euint32 age
) external

// Evaluator functions
function evaluateAthlete(address athlete) external onlyAuthorizedEvaluator

// View functions
function getSelectionInfo(uint32 selectionId) external view
function isAthleteRegistered(uint32 selectionId, address athlete) external view
```

## React Integration

### Component Example

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react'

function AthleteRegistration() {
  const { fhevm, isInitialized } = useFhevm()
  const { encrypt, isEncrypting } = useEncrypt()

  const handleRegister = async (data) => {
    const performance = await encrypt(data.performance, { type: 'uint8' })
    const fitness = await encrypt(data.fitness, { type: 'uint8' })
    const experience = await encrypt(data.experience, { type: 'uint8' })
    const age = await encrypt(data.age, { type: 'uint32' })

    // Submit to contract...
  }

  return <form onSubmit={handleRegister}>...</form>
}
```

## Deployment

### Local Testing

```bash
# Start local network
npx hardhat node

# Deploy
npx hardhat run deploy.js --network localhost

# Run simulation
npx hardhat run scripts/simulate.js --network localhost
```

### Sepolia Testnet

```bash
# Configure .env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_rpc_url

# Deploy
npx hardhat run deploy.js --network sepolia

# Verify
npx hardhat run scripts/verify.js --network sepolia
```

## Files Structure

```
athlete-selection/
├── contracts/
│   └── AnonymousAthleteSelection.sol
├── deploy.js
├── hardhat.config.js
├── README.md
└── package.json
```

## Use Case

### Problem
Traditional athlete selection exposes sensitive personal information:
- Performance metrics
- Health/fitness data
- Age and experience
- Creates potential for bias

### Solution
FHE-powered anonymous selection:
- All data encrypted on-chain
- Evaluators assess without seeing raw data
- Cryptographic proof of fairness
- Complete privacy preservation

## Security Features

- ✅ **Encrypted Storage**: All athlete data stored as FHE ciphertext
- ✅ **Access Control**: Role-based permissions (Committee, Evaluators)
- ✅ **Time-Bound**: Registration and evaluation periods
- ✅ **Audit Trail**: All operations recorded on-chain
- ✅ **Fair Evaluation**: No bias from personal data exposure

## Performance

| Operation | Gas Cost | Description |
|-----------|----------|-------------|
| Register Athlete | ~155,000 | Store encrypted athlete data |
| Evaluate Athlete | ~120,000 | FHE operations on encrypted data |
| Start Selection | ~250,000 | Initialize new selection process |
| Finalize Selection | ~80,000 | Complete and archive results |

## Learn More

- [FHEVM SDK Documentation](../../docs)
- [Smart Contract Security](../../docs/security.md)
- [Zama FHE Docs](https://docs.zama.ai/)
- [Main Project](../../../README.md)

## License

MIT - See LICENSE file for details
