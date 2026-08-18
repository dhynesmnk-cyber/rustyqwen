// Site content lives in localStorage, so it is per-browser: edits made here do
// not follow the editor to another device, and visitors always see the defaults
// below. Publishing content to everyone would need a real backend.

export const STORAGE_KEY = 'rustys-content'

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

// Payloads saved before a field existed are missing it, so every load is merged
// onto the current defaults rather than trusted wholesale.
function fillFromDefaults(saved, fallback) {
  return fallback.map((value, i) => (Array.isArray(saved) && saved[i] != null ? saved[i] : value))
}

function mergeWithDefaults(saved) {
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

export function loadContent() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultContent

  try {
    return mergeWithDefaults(JSON.parse(saved))
  } catch {
    console.error('saved site content was unreadable; falling back to defaults')
    return defaultContent
  }
}

// Throws on failure so callers can report it instead of closing the panel on a
// save that never happened.
export function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  } catch (err) {
    const quotaExceeded =
      err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    throw quotaExceeded
      ? new Error('not enough browser storage — try fewer or smaller images')
      : err
  }
}
