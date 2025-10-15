# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting remarks
- Publishing private information without permission
- Any conduct that could be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git
- Basic knowledge of TypeScript and React
- Understanding of FHEVM concepts

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/TysonDouglas/fhevm-react-template.git
```

## Development Setup

### Install Dependencies

```bash
# Install all dependencies
npm install

# Or install workspace dependencies
npm install --workspaces
```

### Build the SDK

```bash
# Build core SDK
cd packages/fhevm-sdk
npm run build

# Or from root
npm run build:sdk
```

### Run Examples

```bash
# Next.js example
cd examples/nextjs-app
npm install
npm run dev

# React example
cd examples/react-app
npm install
npm start

# Athlete selection example
cd examples/athlete-selection
npm install
npm run dev
```

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes:
```bash
npm test
npm run lint
```

4. Commit your changes:
```bash
git add .
git commit -m "feat: add new feature"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

## How to Contribute

### Reporting Bugs

Before creating a bug report:

1. Check if the bug has already been reported in [Issues](https://github.com/TysonDouglas/fhevm-react-template/issues)
2. Ensure you're using the latest version
3. Verify the issue is reproducible

When creating a bug report, include:

- **Title**: Clear, descriptive title
- **Description**: Detailed description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, SDK version
- **Code Sample**: Minimal code to reproduce
- **Screenshots**: If applicable

**Bug Report Template:**

```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Initialize FHEVM with...
2. Call encrypt function...
3. See error

## Expected Behavior
The function should encrypt the value.

## Actual Behavior
Error: "Invalid value"

## Environment
- OS: Windows 11
- Node: 18.17.0
- SDK Version: 1.0.0
- Browser: Chrome 120

## Code Sample
\`\`\`typescript
const fhevm = await initFhevm({ network: 'sepolia' })
const encrypted = await encryptInput(42, fhevm)
\`\`\`

## Additional Context
This only happens when...
```

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been suggested
2. Explain the use case
3. Describe the expected behavior
4. Consider implementation details
5. Be open to discussion

**Feature Request Template:**

```markdown
## Feature Description
A clear description of the feature.

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other solutions did you consider?

## Additional Context
Any other relevant information.
```

### Contributing Code

We welcome code contributions! Areas where you can help:

- **Bug Fixes**: Fix reported issues
- **Features**: Implement new functionality
- **Documentation**: Improve guides and examples
- **Tests**: Add or improve test coverage
- **Examples**: Create new framework examples
- **Performance**: Optimize existing code

### First-Time Contributors

Look for issues tagged with:
- `good first issue` - Great for beginners
- `help wanted` - We need help with these
- `documentation` - Documentation improvements

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**:
```bash
npm test
```

3. **Lint your code**:
```bash
npm run lint
npm run format
```

4. **Build successfully**:
```bash
npm run build
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**

```bash
feat(sdk): add batch encryption support

Add createEncryptedInput function that allows batching
multiple values into a single encryption operation.

Closes #123

---

fix(react): resolve hook dependency issue

Fix useEncrypt hook causing infinite re-renders when
encrypt function is used in useEffect dependencies.

Fixes #456

---

docs(api): update encryption examples

Add more examples showing different data types and
batch encryption patterns.
```

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Added new function `batchEncrypt`
- Updated documentation
- Added tests

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing

## Screenshots (if applicable)
[Add screenshots]

## Additional Notes
[Any additional context]
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address review comments
4. **Approval**: At least one maintainer approval required
5. **Merge**: Maintainers merge your PR

### After Merge

- Your contribution will be included in the next release
- You'll be added to contributors list
- Thank you! 🎉

## Coding Standards

### TypeScript

```typescript
// Use explicit types
function encryptValue(value: number, type: EncryptedType): Promise<EncryptedValue> {
  // Implementation
}

// Use interfaces for objects
interface FhevmConfig {
  network: string
  contractAddress?: string
}

// Use enums for constants
enum EncryptedType {
  UINT8 = 'uint8',
  UINT16 = 'uint16',
  UINT32 = 'uint32'
}
```

### React

```tsx
// Use functional components
export function MyComponent({ prop }: MyComponentProps) {
  return <div>{prop}</div>
}

// Use hooks appropriately
export function useMyHook() {
  const [state, setState] = useState(null)
  return { state, setState }
}

// Proper prop types
interface MyComponentProps {
  prop: string
  optional?: number
}
```

### File Structure

```
packages/fhevm-sdk/
├── src/
│   ├── core/           # Framework-agnostic
│   ├── react/          # React-specific
│   ├── utils/          # Utilities
│   └── types/          # TypeScript types
├── tests/              # Test files
└── package.json
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use trailing commas

```typescript
// Good
const config = {
  network: 'sepolia',
  contractAddress: '0x...',
}

// Bad
const config = {network: "sepolia", contractAddress: "0x..."}
```

## Testing Guidelines

### Unit Tests

```typescript
// tests/encrypt.test.ts
import { encryptInput } from '../src/core/encrypt'

describe('encryptInput', () => {
  it('should encrypt uint8 value', async () => {
    const fhevm = await initFhevm({ network: 'localhost' })
    const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })

    expect(encrypted.handle).toBeDefined()
    expect(encrypted.inputProof).toBeDefined()
    expect(encrypted.type).toBe('uint8')
  })

  it('should throw for invalid value', async () => {
    const fhevm = await initFhevm({ network: 'localhost' })

    await expect(
      encryptInput(-1, fhevm, { type: 'uint8' })
    ).rejects.toThrow('Invalid value')
  })
})
```

### Integration Tests

```typescript
// tests/integration/workflow.test.ts
describe('Complete FHEVM Workflow', () => {
  it('should complete encrypt-submit-decrypt flow', async () => {
    // Initialize
    const fhevm = await initFhevm({ network: 'localhost' })

    // Encrypt
    const encrypted = await encryptInput(42, fhevm)

    // Submit to contract
    const tx = await contract.submitData(encrypted.handle, encrypted.inputProof)
    await tx.wait()

    // Retrieve and decrypt
    const encryptedResult = await contract.getData()
    const decrypted = await userDecrypt(encryptedResult, fhevm, { ... })

    expect(decrypted.value).toBe(42)
  })
})
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths and error cases
- Include edge cases
- Test async operations

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test encrypt.test.ts
```

## Documentation

### Code Comments

```typescript
/**
 * Encrypt a value using FHEVM
 *
 * @param value - The value to encrypt
 * @param fhevm - FHEVM instance
 * @param options - Encryption options
 * @returns Encrypted value with handle and proof
 *
 * @example
 * ```typescript
 * const encrypted = await encryptInput(42, fhevm, { type: 'uint8' })
 * console.log(encrypted.handle)
 * ```
 */
export async function encryptInput(
  value: number | bigint,
  fhevm: FhevmInstance,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  // Implementation
}
```

### Documentation Updates

When adding features, update:

- **API Reference**: Document new functions
- **Getting Started**: Add usage examples
- **Migration Guide**: Note breaking changes
- **README**: Update feature list
- **CHANGELOG**: Add entry for changes

### Example Structure

```typescript
// examples/new-framework/
├── README.md          # Setup and usage
├── package.json       # Dependencies
├── src/
│   └── index.ts      # Main example
└── .env.example      # Environment template
```

## Release Process

Maintainers handle releases, but contributors should:

1. **Update CHANGELOG.md** with your changes
2. **Follow semantic versioning** in commits
3. **Note breaking changes** clearly

## Questions?

- **Documentation**: Check [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/TysonDouglas/fhevm-react-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TysonDouglas/fhevm-react-template/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Universal FHEVM SDK!** 🙏

Your contributions help make privacy-preserving blockchain development accessible to everyone.
