# Demo Video Guide

## Overview

The `demo.mp4` file should demonstrate the complete functionality of the FHEVM SDK with real-world usage examples.

## Video Requirements

**Duration**: 3-5 minutes
**Format**: MP4, 1920x1080 (1080p recommended)
**Audio**: Clear narration explaining each step

## Content Outline

### 1. Introduction (30 seconds)
- Brief overview of FHEVM SDK
- Key features highlight
- What viewers will see in the demo

### 2. SDK Setup (45 seconds)
- Show package installation
```bash
npm install @fhevm/sdk
```
- Display basic initialization code
- Explain framework-agnostic design

### 3. React Integration Demo (60 seconds)
- Show `FhevmProvider` setup
- Demonstrate `useEncrypt` hook
- Live encryption of sample data
- Display encrypted output

### 4. Next.js Example (60 seconds)
- Navigate through the Next.js application
- Show encryption form in action
- Demonstrate decryption with signature
- Display real-time results

### 5. Athlete Selection Use Case (90 seconds)
- Explain the real-world scenario
- Show contract deployment
- Demonstrate:
  - Committee starting a selection
  - Athletes registering with encrypted data
  - Evaluators assessing without seeing raw data
  - Selection finalization
- Highlight privacy preservation

### 6. API Overview (30 seconds)
- Quick tour of main API functions:
  - `initFhevm()`
  - `encryptInput()`
  - `createEncryptedInput()`
  - `userDecrypt()`
- Show code snippets on screen

### 7. Conclusion (15 seconds)
- Recap key benefits
- Call to action (documentation link)
- GitHub repository link

## Recording Checklist

- [ ] Clear audio with minimal background noise
- [ ] Readable code font size (14pt minimum)
- [ ] Smooth transitions between sections
- [ ] Real terminal/browser footage (no placeholder text)
- [ ] Working examples (actually run the code)
- [ ] Professional presentation
- [ ] Subtitles/captions (optional but recommended)

## Tools Recommended

**Screen Recording**:
- OBS Studio (Free, Windows/Mac/Linux)
- QuickTime (Mac)
- Windows Game Bar (Windows)
- Loom (Cross-platform)

**Video Editing**:
- DaVinci Resolve (Free)
- Adobe Premiere Pro
- iMovie (Mac)
- Shotcut (Free)

**Audio**:
- Audacity (Free audio editing)
- Use a quality microphone
- Record in a quiet environment

## Technical Setup

### Before Recording

1. **Clean Environment**
   - Clear terminal history
   - Close unnecessary applications
   - Disable notifications
   - Clear browser cache/cookies

2. **Test Setup**
   - Verify all examples work
   - Have contract deployed on testnet
   - Pre-fund test accounts
   - Test network connectivity

3. **Code Snippets Ready**
   - Have sample code in text editor
   - Proper syntax highlighting
   - Increase font size for visibility

### Recording Settings

- **Resolution**: 1920x1080
- **Frame Rate**: 30fps minimum
- **Bitrate**: 8-10 Mbps
- **Audio**: 44.1kHz, stereo

## Script Template

```
[INTRO]
"Welcome to the FHEVM SDK demonstration. In this video, I'll show you how to
integrate Fully Homomorphic Encryption into your blockchain applications with
just a few lines of code."

[SETUP]
"Let's start by installing the SDK. It's as simple as running npm install..."

[REACT DEMO]
"Here's how easy it is to use FHEVM in React. We wrap our app with FhevmProvider..."

[NEXTJS DEMO]
"Now let's see a full Next.js application in action. I can encrypt sensitive data..."

[ATHLETE SELECTION]
"Let me show you a real-world use case: anonymous athlete selection..."

[API OVERVIEW]
"The SDK provides a clean, simple API. Here are the main functions you'll use..."

[CONCLUSION]
"As you've seen, FHEVM SDK makes privacy-preserving blockchain development
simple and accessible. Check out the documentation for more details."
```

## After Recording

1. **Review**
   - Watch entire video
   - Check audio levels
   - Verify all demonstrations work
   - Ensure no sensitive information visible

2. **Edit**
   - Add intro/outro slides
   - Include text overlays for key points
   - Add transitions
   - Adjust audio levels

3. **Export**
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080
   - Quality: High (8-10 Mbps)
   - File size: < 100MB if possible

4. **Final Check**
   - Play on different devices
   - Verify audio sync
   - Check video quality
   - Confirm file size acceptable

## Distribution

Once `demo.mp4` is ready:
1. Place in project root: `fhevm-react-template/demo.mp4`
2. Update README.md with video link if hosted online
3. Consider uploading to YouTube/Vimeo for wider reach
4. Include timestamp links in documentation

## Alternative: Animated Demo

If live recording isn't feasible, consider:
- Animated code walkthroughs
- Terminal recording with asciinema
- Slides with code examples
- Combination of screenshots and narration

## Questions During Recording?

Focus on:
- Why use FHEVM? (Privacy preservation)
- How easy is integration? (< 10 lines of code)
- What makes it unique? (Framework-agnostic, wagmi-like API)
- Real-world applications? (Athlete selection example)
