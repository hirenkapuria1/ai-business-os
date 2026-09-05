const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  if (current.count >= limit) return { allowed: false, remaining: 0, resetAt: current.resetAt }
  current.count += 1
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt }
}

export function requestKey(request: Request, scope: string) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return `${scope}:${forwarded || request.headers.get('x-real-ip') || 'unknown'}`
}

const sensitiveKey = /password|token|secret|signature|api.?key|authorization|cookie/i

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sensitiveKey.test(key) ? '[REDACTED]' : redact(item)]))
  }
  return value
}

export function validateProductionConfig(env: Record<string, string | undefined>) {
  const required = ['DATABASE_URL', 'JWT_SECRET']
  const missing = required.filter((key) => !env[key])
  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) missing.push('JWT_SECRET (minimum 32 characters)')
  if (missing.length) throw new Error(`Missing or invalid production configuration: ${missing.join(', ')}`)
}
