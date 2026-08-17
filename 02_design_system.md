# Design system

## Design intent

The visual language for Rusty's Sandwich Parlour must match the brand logo and use an orange-on-orange tonal hierarchy. The interface should feel bold, local, and practical, with clear blocks of colour and strong typographic contrast.

The design must use solid block colours only. Gradients are strictly forbidden.

Containers, sections, cards, navigation, and cart elements should be separated through distinct shade differences, clear boundaries, and consistent spacing rather than through decorative effects.

## Colour palette

The palette is an orange tonal system. The exact final hex values should be checked against the brand logo, but the hierarchy should follow the structure below.

| Token | Suggested value | Purpose | Contrast guidance |
|---|---:|---|---|
| `--colour-page-background` | `#FFF7EF` | Main page background | Very light orange base. Use dark text. |
| `--colour-section-background` | `#FFE8D1` | Alternate sections and content bands | Light orange. Use dark text. |
| `--colour-card-background` | `#FFD8AD` | Menu item cards, form panels, informational blocks | Medium-light orange. Use dark text. |
| `--colour-cart-background` | `#FFC182` | Cart summary, checkout summary, sticky order bar | Medium orange. Use dark text. |
| `--colour-action` | `#E8590C` | Primary buttons, selected controls, active tab indicators | Use dark text unless contrast testing proves otherwise. |
| `--colour-action-strong` | `#B23A00` | Strong call-to-action background, active navigation, footer block | Only use light text if WCAG contrast is confirmed. |
| `--colour-border` | `#8C3A00` | Borders, dividers, emphasis outlines | Use where stronger separation is needed. |
| `--colour-text-primary` | `#2A1200` | Body text, headings, form labels | Primary text colour. |
| `--colour-text-inverse` | `#FFF9F2` | Text on the darkest orange surfaces only | Use only after contrast testing. |

### Colour rules

- Use solid fills only.
- Do not use gradients anywhere in the interface.
- Do not use translucent orange overlays as a primary styling device.
- Separate sections by using clearly different orange shades.
- Ensure primary text remains highly legible on all backgrounds.
- Avoid white or very light text on mid-orange backgrounds unless contrast testing confirms accessibility.
- Where practical, all text and interactive elements should meet WCAG AA contrast standards.

## Typography

The typeface should be clean, utilitarian, and highly readable.

Recommended primary typeface:

```css
font-family: "Inter", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
```

If Inter is not available, use an equivalent clean sans-serif. The typeface should be self-hosted where practical to avoid unnecessary third-party requests.

### Typeface usage

| Element | Suggested style |
|---|---|
| Body text | 16px minimum, 400 weight, 1.5 line height |
| Small labels | 14px minimum, 600 weight |
| Menu item title | 18px to 20px, 600 or 700 weight |
| Section heading | 24px to 32px, 700 weight |
| Price | 16px to 18px, 700 weight |
| Button label | 16px minimum, 600 or 700 weight |

### Legibility rules

- All text must be high contrast against its background.
- Body text should use `--colour-text-primary`.
- Do not rely on font size alone to communicate important information.
- Avoid uppercase-only body text.
- Use sentence case for most labels, buttons, and headings.
- Ensure line length remains readable on mobile devices.
- Maintain sufficient vertical spacing between lines and sections.

## Layout principles

The layout must be mobile-first. Most customers are expected to order from a phone while deciding what to collect from the venue.

### Structure

- Use a single-column layout on small screens.
- Introduce wider grids only at larger breakpoints.
- Use clear geometric blocks for menu items, cart elements, forms, and informational sections.
- Keep cards rectangular and predictable.
- Avoid decorative shapes that reduce readable space.
- Use consistent container widths and padding.

### Spacing

Use an 8px spacing scale where practical.

| Token | Value | Usage |
|---|---:|---|
| `--space-1` | 4px | Minor internal adjustment |
| `--space-2` | 8px | Tight internal spacing |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Default component padding |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large section spacing |

Readable spacing is important. Do not compress menu descriptions, prices, modifier options, or form fields too tightly.

### Accessibility and focus states

Interactive elements must have clearly visible focus states.

Recommended focus style:

```css
:focus-visible {
  outline: 3px solid var(--colour-text-primary);
  outline-offset: 2px;
}
```

On dark orange surfaces, use a high-contrast light focus colour instead:

```css
.dark-orange-surface :focus-visible {
  outline: 3px solid var(--colour-text-inverse);
  outline-offset: 2px;
}
```

Additional accessibility guidance:

- Ensure buttons have a minimum touch target of 44px by 44px.
- Ensure form fields have visible labels.
- Do not rely on colour alone to indicate errors, selection, or availability.
- Provide clear disabled states.
- Provide obvious pressed and selected states.
- Keep motion minimal and functional.
