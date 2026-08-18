import { timingSafeEqual } from 'node:crypto'

// The passcode lives only in the Netlify environment. If it is not configured
// the endpoints fail closed rather than falling back to a default, so a
// misconfigured deploy cannot be edited by anyone who guesses a constant.
export function isAuthorised(request) {
  const expected = process.env.ADMIN_PASSCODE
  if (!expected) return false

  const header = request.headers.get('authorization') || ''
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : ''
  return constantTimeEquals(supplied, expected)
}

export function constantTimeEquals(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export function passcodeConfigured() {
  return Boolean(process.env.ADMIN_PASSCODE)
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers }
  })
}
