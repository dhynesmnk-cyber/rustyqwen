import { getStore } from '@netlify/blobs'
import { isAuthorised, passcodeConfigured, json } from '../lib/adminAuth.js'
import { validateContent, ValidationError } from '../lib/validateContent.js'

export const config = { path: '/api/content' }

const STORE = 'site-content'
const KEY = 'content'

// Images are uploaded separately and referenced by URL, so this payload stays a
// couple of kilobytes — small enough for every visitor to fetch on load.
const MAX_BODY_BYTES = 256 * 1024

export default async function handler(request) {
  const store = getStore(STORE)

  if (request.method === 'GET') {
    const stored = await store.get(KEY, { type: 'json' })
    if (!stored) {
      // No published content yet: the client falls back to its built-in copy.
      return json({ content: null, updatedAt: null }, 200, { 'cache-control': 'no-cache' })
    }
    return json(stored, 200, { 'cache-control': 'no-cache' })
  }

  if (request.method !== 'PUT') {
    return json({ error: 'method not allowed' }, 405, { allow: 'GET, PUT' })
  }

  if (!passcodeConfigured()) {
    return json({ error: 'ADMIN_PASSCODE is not configured on this site' }, 503)
  }
  if (!isAuthorised(request)) {
    return json({ error: 'incorrect passcode' }, 401)
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: 'content payload is too large' }, 413)
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return json({ error: 'body must be valid JSON' }, 400)
  }

  let content
  try {
    content = validateContent(parsed)
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400)
    throw err
  }

  const record = { content, updatedAt: new Date().toISOString() }
  await store.setJSON(KEY, record)
  return json(record)
}
