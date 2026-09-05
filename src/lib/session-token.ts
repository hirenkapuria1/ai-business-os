import jwt, { type JwtPayload } from 'jsonwebtoken'

interface SessionPayload extends JwtPayload {
  userId: string
}

function isSessionPayload(payload: string | JwtPayload): payload is SessionPayload {
  return typeof payload !== 'string' && typeof payload.userId === 'string'
}

export function createSignedSession(userId: string, secret: string, expiresIn = '7d') {
  return jwt.sign({ userId }, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
}

export function readSignedSession(token: string, secret: string) {
  try {
    const payload = jwt.verify(token, secret)
    return isSessionPayload(payload) ? payload : null
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return null
    throw error
  }
}
