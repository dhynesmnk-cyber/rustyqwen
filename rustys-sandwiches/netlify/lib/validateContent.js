// Anything that reaches the blob store is rendered on the public site, so the
// write endpoint accepts only a known shape with bounded sizes rather than
// storing whatever JSON it is handed.

const LIMITS = {
  title: 120,
  tagline: 300,
  preorderEmail: 254,
  caption: 200,
  itemName: 120,
  itemDescription: 400,
  menuItems: 40,
  supportSlots: 3
}

// Images are either an uploaded blob served by our own media endpoint, or an
// absolute https URL. This rejects `javascript:` and other scheme tricks.
const MEDIA_PATH = /^\/api\/media\/[a-f0-9]{32}$/
const isAllowedImage = (value) =>
  typeof value === 'string' &&
  (MEDIA_PATH.test(value) || /^https:\/\/[^\s]+$/i.test(value))

const cleanString = (value, max) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

class ValidationError extends Error {}

function requireString(value, max, field) {
  const cleaned = cleanString(value, max)
  if (!cleaned) throw new ValidationError(`${field} is required`)
  return cleaned
}

function requireImage(value, field) {
  if (!isAllowedImage(value)) throw new ValidationError(`${field} must be an uploaded image or https URL`)
  return value
}

function fixedLengthArray(value, length, field) {
  if (!Array.isArray(value) || value.length !== length) {
    throw new ValidationError(`${field} must have exactly ${length} entries`)
  }
  return value
}

export function validateContent(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('content must be an object')

  const menuItems = Array.isArray(input.menuItems) ? input.menuItems : []
  if (menuItems.length > LIMITS.menuItems) {
    throw new ValidationError(`no more than ${LIMITS.menuItems} menu items`)
  }

  return {
    title: requireString(input.title, LIMITS.title, 'title'),
    tagline: requireString(input.tagline, LIMITS.tagline, 'tagline'),
    preorderEmail: requireString(input.preorderEmail, LIMITS.preorderEmail, 'preorderEmail'),
    heroImage: requireImage(input.heroImage, 'heroImage'),
    supportImages: fixedLengthArray(input.supportImages, LIMITS.supportSlots, 'supportImages').map(
      (src, i) => requireImage(src, `supportImages[${i}]`)
    ),
    supportCaptions: fixedLengthArray(
      input.supportCaptions,
      LIMITS.supportSlots,
      'supportCaptions'
    ).map((caption) => cleanString(caption, LIMITS.caption)),
    menuItems: menuItems.map((item, i) => ({
      id: Number.isFinite(Number(item?.id)) ? Number(item.id) : i + 1,
      name: requireString(item?.name, LIMITS.itemName, `menuItems[${i}].name`),
      description: cleanString(item?.description, LIMITS.itemDescription),
      price: Math.max(0, Math.min(9999, Math.round(Number(item?.price) || 0)))
    }))
  }
}

export { ValidationError, LIMITS }
