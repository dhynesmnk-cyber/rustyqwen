import { createHash } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { isAuthorised, passcodeConfigured, json } from '../lib/adminAuth.js'

export const config = { path: ['/api/media', '/api/media/:id'] }

const STORE = 'site-media'
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const idFromPath = (url) => new URL(url).pathname.split('/').pop()

export default async function handler(request) {
  const store = getStore(STORE)

  // Serving an uploaded image. Ids are content hashes, so a given id always
  // holds the same bytes and can be cached indefinitely.
  if (request.method === 'GET') {
    const id = idFromPath(request.url)
    if (!/^[a-f0-9]{32}$/.test(id)) return json({ error: 'not found' }, 404)

    const blob = await store.getWithMetadata(id, { type: 'arrayBuffer' })
    if (!blob) return json({ error: 'not found' }, 404)

    return new Response(blob.data, {
      headers: {
        'content-type': blob.metadata?.contentType || 'application/octet-stream',
        'cache-control': 'public, max-age=31536000, immutable'
      }
    })
  }

  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405, { allow: 'GET, POST' })
  }

  if (!passcodeConfigured()) {
    return json({ error: 'ADMIN_PASSCODE is not configured on this site' }, 503)
  }
  if (!isAuthorised(request)) {
    return json({ error: 'incorrect passcode' }, 401)
  }

  const contentType = (request.headers.get('content-type') || '').split(';')[0].trim()
  if (!ALLOWED_TYPES.has(contentType)) {
    return json({ error: 'image must be a JPEG, PNG or WebP' }, 415)
  }

  const bytes = new Uint8Array(await request.arrayBuffer())
  if (bytes.byteLength === 0) return json({ error: 'image is empty' }, 400)
  if (bytes.byteLength > MAX_UPLOAD_BYTES) return json({ error: 'image is too large' }, 413)

  // Hashing the bytes means re-uploading the same picture reuses one blob.
  const id = createHash('md5').update(bytes).digest('hex')
  await store.set(id, bytes, { metadata: { contentType } })

  return json({ url: `/api/media/${id}` }, 201)
}
