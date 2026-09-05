export type AppRole = 'ADMIN' | 'CUSTOMER'

export function canAccessAdmin(role: AppRole) {
  return role === 'ADMIN'
}

export function canAccessUserResource(actorId: string, resourceOwnerId: string) {
  return actorId === resourceOwnerId
}
