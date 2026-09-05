import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/access-policy'

export type AuthorizedUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>

export function isAdmin(user: AuthorizedUser) {
  return canAccessAdmin(user.role)
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (!isAdmin(user)) redirect('/dashboard')
  return user
}
