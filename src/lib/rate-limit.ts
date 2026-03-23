import { NextRequest, NextResponse } from "next/server"

// Basit in-memory rate limiter (production'da Redis kullanılmalı)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const DEFAULT_WINDOW_MS = 15 * 60 * 1000 // 15 dakika
const DEFAULT_MAX_ATTEMPTS = 5

// Auto-cleanup her 5 dakikada bir
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > DEFAULT_WINDOW_MS * 2) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  maxAttempts?: number
  windowMs?: number
  prefix?: string // endpoint-specific rate limiting
}

export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number } {
  const {
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    windowMs = DEFAULT_WINDOW_MS,
    prefix = "default",
  } = options

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const key = `${prefix}:${ip}`
  const now = Date.now()

  const entry = rateLimitMap.get(key)

  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now })
    return { success: true, remaining: maxAttempts - 1 }
  }

  if (entry.count >= maxAttempts) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: maxAttempts - entry.count }
}

export function rateLimitResponse(retryAfterSeconds = 900) {
  return NextResponse.json(
    { error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfterSeconds.toString(),
        "X-RateLimit-Remaining": "0",
      },
    }
  )
}

