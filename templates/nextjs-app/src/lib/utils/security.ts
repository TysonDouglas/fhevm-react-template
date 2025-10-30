/**
 * Security Utilities
 * Helper functions for security and validation
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s.-]/gi, '')
}

/**
 * Validate numeric value for encryption
 */
export function validateNumericValue(
  value: number,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64'
): boolean {
  const ranges = {
    uint8: { min: 0, max: 255 },
    uint16: { min: 0, max: 65535 },
    uint32: { min: 0, max: 4294967295 },
    uint64: { min: 0, max: Number.MAX_SAFE_INTEGER }
  }

  const range = ranges[type]
  return value >= range.min && value <= range.max
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(key) || []

  // Filter out old timestamps
  const recentTimestamps = timestamps.filter(t => now - t < windowMs)

  if (recentTimestamps.length >= maxRequests) {
    return false
  }

  recentTimestamps.push(now)
  rateLimitMap.set(key, recentTimestamps)
  return true
}
