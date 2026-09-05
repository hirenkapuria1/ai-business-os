import { redact } from '@/lib/security'

export function logEvent(level: 'info' | 'warn' | 'error', event: string, details: Record<string, unknown> = {}) {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), level, event, details: redact(details) })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.info(entry)
}
