import { isAuthorised, passcodeConfigured, json } from '../lib/adminAuth.js'

export const config = { path: '/api/admin-verify' }

// Lets the panel tell the editor the passcode is wrong at unlock time rather
// than only when they try to save. The passcode is checked here in exactly the
// same way as on every write, so this endpoint grants nothing on its own.
export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405, { allow: 'POST' })
  }
  if (!passcodeConfigured()) {
    return json({ error: 'ADMIN_PASSCODE is not configured on this site' }, 503)
  }
  if (!isAuthorised(request)) {
    return json({ error: 'incorrect passcode' }, 401)
  }
  return json({ ok: true })
}
