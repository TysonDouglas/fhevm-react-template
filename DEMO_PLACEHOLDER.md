# Demo Video Placeholder

## Status: To Be Created

The `demo.mp4` video file should be placed in this directory to demonstrate the FHEVM SDK functionality.

## What Should Be Included

The demo video should showcase:

1. **Quick Start** - Installation and basic setup (< 2 minutes)
2. **React Integration** - Using hooks in a React application
3. **Next.js Example** - Full-featured Next.js application walkthrough
4. **Real-World Use Case** - Athlete selection example with privacy preservation
5. **API Overview** - Key functions and their usage

## Recording Guidelines

See [DEMO_VIDEO_GUIDE.md](./DEMO_VIDEO_GUIDE.md) for complete instructions on:
- Content outline with timing
- Technical requirements
- Recording tools and setup
- Script template
- Post-production checklist

## Temporary Resources

Until the video is created, refer to:

### Live Demo Links
- **Next.js Example**: [Deploy to Vercel]
- **Documentation**: [GitHub Pages]
- **Interactive Playground**: [CodeSandbox]

### Screenshot Alternatives

Key screenshots to capture:

1. **Installation**
```bash
npm install @fhevm/sdk
```

2. **Provider Setup**
```tsx
<FhevmProvider config={config}>
  <App />
</FhevmProvider>
```

3. **Encryption Hook**
```tsx
const { encrypt } = useEncrypt()
const encrypted = await encrypt(42)
```

4. **Athlete Selection**
- Committee dashboard
- Athlete registration form
- Encrypted data visualization
- Selection results

### Text Walkthrough

**Step 1: Install SDK**
```bash
npm install @fhevm/sdk
```

**Step 2: Initialize**
```typescript
import { initFhevm } from '@fhevm/sdk'

const fhevm = await initFhevm({
  network: 'sepolia',
  contractAddress: '0x...'
})
```

**Step 3: Encrypt Data**
```typescript
import { createEncryptedInput } from '@fhevm/sdk'

const encrypted = await createEncryptedInput(fhevm, userAddress)
  .add8(42)
  .add32(1000)
  .encrypt()
```

**Step 4: Use in React**
```tsx
import { useEncrypt } from '@fhevm/sdk/react'

function MyComponent() {
  const { encrypt, isEncrypting } = useEncrypt()

  const handleEncrypt = async () => {
    const result = await encrypt(42, { type: 'uint8' })
    console.log(result.handle)
  }

  return <button onClick={handleEncrypt}>Encrypt</button>
}
```

## Expected Video Specifications

- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 3-5 minutes
- **Audio**: Clear narration, 44.1kHz stereo
- **File Size**: < 100MB
- **Frame Rate**: 30fps

## How to Add the Video

Once recorded:

1. Place the video file in this directory:
   ```
   fhevm-react-template/demo.mp4
   ```

2. Update the main README.md:
   ```markdown
   ## Demo Video

   Watch the [demo video](./demo.mp4) to see the SDK in action.
   ```

3. Consider uploading to video platforms:
   - YouTube (recommended for reach)
   - Vimeo (better quality preservation)
   - GitHub Releases (direct download)

4. Add to documentation:
   ```markdown
   [📹 Watch Demo](./demo.mp4) | [🎥 YouTube](link) | [📺 Vimeo](link)
   ```

## Contact for Video Production

If you need assistance with video production:
- Professional narration
- Screen recording
- Video editing
- Animation

Please refer to the [DEMO_VIDEO_GUIDE.md](./DEMO_VIDEO_GUIDE.md) for DIY instructions or consider hiring a technical content creator.

## Alternative: GIF Animations

For quick demonstrations, consider creating GIFs for:
- Installation process
- Basic encryption example
- Next.js app interaction
- Athlete registration flow

Tools for GIF creation:
- LICEcap (Windows/Mac)
- ScreenToGif (Windows)
- Kap (Mac)
- peek (Linux)

## Checklist for Completion

- [ ] Record 3-5 minute demo video
- [ ] Include all required sections (intro, setup, demos, conclusion)
- [ ] Export as MP4 (1920x1080, H.264)
- [ ] File size < 100MB
- [ ] Place in `fhevm-react-template/demo.mp4`
- [ ] Update README.md with video reference
- [ ] Optional: Upload to YouTube/Vimeo
- [ ] Optional: Create GIF highlights
- [ ] Delete this placeholder file

---

**Note**: This is a placeholder file. Once `demo.mp4` is created and added to the repository, this file can be removed.
