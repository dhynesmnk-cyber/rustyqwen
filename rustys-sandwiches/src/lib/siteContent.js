// Content is published through /api/content and stored server-side, so an edit
// made in one browser is what every visitor sees. The defaults below are the
// fallback for a site that has never been edited, and for when the API cannot
// be reached (including local `vite preview`, which serves no functions).

export const defaultContent = {
  title: "rusty's sandwich parlour",
  tagline: 'where every bite tells a story of craftsmanship and care',
  preorderEmail: 'orders@rustyssandwichparlour.com',
  heroImage: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=1600&q=80',
  supportImages: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    'https://images.unsplash.com/photo-1509721437493-41fa6e2fb819?w=800&q=80',
    'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80'
  ],
  supportCaptions: [
    'baked in-house every morning',
    'cured, sliced and stacked to order',
    'pulled slow, dressed sharp'
  ],
  menuItems: [
    { id: 1, name: 'The Rusty Classic', description: 'Roast beef, aged cheddar, horseradish cream', price: 14 },
    { id: 2, name: 'Turkey Club Deluxe', description: 'Smoked turkey, bacon, avocado, lettuce, tomato', price: 13 },
    { id: 3, name: 'Italian Stallion', description: 'Salami, capicola, provolone, giardiniera, hot peppers', price: 15 },
    { id: 4, name: 'Veggie Supreme', description: 'Hummus, roasted vegetables, sprouts, swiss cheese', price: 12 },
    { id: 5, name: 'BBQ Pulled Pork', description: 'Slow-cooked pork, coleslaw, pickles, BBQ sauce', price: 14 },
    { id: 6, name: 'Grilled Cheese Melt', description: 'Three cheese blend, caramelized onions, sourdough', price: 11 }
  ]
}

// Content published before a field existed is missing it, so every response is
// merged onto the current defaults rather than trusted wholesale.
function fillFromDefaults(saved, fallback) {
  return fallback.map((value, i) => (Array.isArray(saved) && saved[i] != null ? saved[i] : value))
}

export function mergeWithDefaults(saved) {
  if (!saved || typeof saved !== 'object') return defaultContent
  return {
    ...defaultContent,
    ...saved,
    supportImages: fillFromDefaults(saved.supportImages, defaultContent.supportImages),
    supportCaptions: fillFromDefaults(saved.supportCaptions, defaultContent.supportCaptions),
    menuItems:
      Array.isArray(saved.menuItems) && saved.menuItems.length
        ? saved.menuItems
        : defaultContent.menuItems
  }
}

async function errorFrom(response, fallback) {
  const body = await response.json().catch(() => null)
  return new Error(body?.error || fallback)
}

export async function fetchContent() {
  try {
    const response = await fetch('/api/content')
    if (!response.ok) throw new Error(`content request failed (${response.status})`)
    const { content } = await response.json()
    return mergeWithDefaults(content)
  } catch (err) {
    // An unreachable API is not worth breaking the page over; show the defaults.
    console.warn('using built-in content:', err.message)
    return defaultContent
  }
}

export async function verifyPasscode(passcode) {
  const response = await fetch('/api/admin-verify', {
    method: 'POST',
    headers: { authorization: `Bearer ${passcode}` }
  })
  if (response.ok) return
  throw await errorFrom(response, 'could not check that passcode')
}

export async function publishContent(content, passcode) {
  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: { authorization: `Bearer ${passcode}`, 'content-type': 'application/json' },
    body: JSON.stringify(content)
  })
  if (!response.ok) throw await errorFrom(response, 'could not save changes')
  const { content: saved } = await response.json()
  return mergeWithDefaults(saved)
}

export async function uploadImage(blob, passcode) {
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: { authorization: `Bearer ${passcode}`, 'content-type': blob.type },
    body: blob
  })
  if (!response.ok) throw await errorFrom(response, 'could not upload that image')
  const { url } = await response.json()
  return url
}
