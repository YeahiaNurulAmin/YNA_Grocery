<!--
  DESIGN_SYSTEM.md — YNA Grocery design tokens, components, and screen map for developers.
  Companion to DESIGN_BOARD.html. Source of truth for colors remains client/src/index.css.
-->

# YNA Grocery Design System

**Tagline:** Fresh groceries, delivered with care.  
**Stack:** React · Tailwind CSS v4 · Lucide · Manrope + Inter

## Brand

| Token | Value | Use |
|-------|-------|-----|
| Primary | `#22c55e` | CTAs, focus, success |
| Primary dark | `#16a34a` | Hover |
| Accent | `#ff6b35` | Highlights, badges, energy |
| Surfaces | White / `#fafafa` cream | Cards, page bg |
| Radius card | `24px` | Cards, panels |
| Radius button/input | `16px` | Controls |
| Radius dialog | `28px` | Modals |
| Motion | `200–300ms` | Hover, fade, slide |

## Typography

- **Headings:** Manrope (`font-heading`)
- **Body:** Inter (`font-body`)
- **Fallback:** Open Sans

## Logo

`src/assets/YNALogo.jsx` — green rounded square + bag + orange leaf tip; wordmark “YNA / GROCERY”.  
Variants: `full` | `icon`; sizes: `icon` | `small` | `medium` | `large`.

## Component library

Import from `src/components/ui/index.jsx`:

- `Button` — primary | accent | secondary | outline | ghost | danger
- `Input` / `Textarea`
- `Card` — optional hover lift
- `Badge` — success | accent | warning | error | info | outline
- `EmptyState` / `Skeleton` / `ProductCardSkeleton`
- `SectionHeader` / `Page`

Shared chrome: `Navbar`, `Footer`, `MobileBottomNav`, `ProductCard`, `Login`.

## Screen map (customer)

| Screen | Route |
|--------|-------|
| Home | `/` |
| Products | `/products` |
| Category | `/products/:category` |
| Product Details | `/products/:category/:id` |
| Cart | `/cart` |
| Add Address | `/add-address` |
| My Orders | `/my-orders` |
| Search | `/search` |
| Contact / FAQ / About | `/contact` `/faq` `/about` |
| Privacy / Terms | `/privacy` `/terms` |
| Wishlist / Recently Viewed | `/wishlist` `/recently-viewed` (UI only) |
| Loader | `/loader` |
| 404 | `*` |

## Screen map (seller)

| Screen | Route |
|--------|-------|
| Login | `/seller` (unauth) |
| Add Product | `/seller` (index) |
| Dashboard | `/seller/dashboard` |
| Products / Edit | `/seller/products` `/seller/update-product/:id` |
| Orders / History | `/seller/orders` `/seller/history` |
| Coupons | `/seller/coupons` |
| Notifications / Settings / Profile | `/seller/notifications` `/seller/settings` `/seller/profile` |

## Dark mode

Toggle on `html.dark`. OLED-friendly surfaces (`#030712` / `#111827`), not inverted greens. Theme key: `localStorage.yna_theme`.

## Accessibility

- Visible `:focus-visible` rings (primary)
- Touch targets ≥ 40px on mobile nav
- Semantic headings, labels on forms
- High-contrast text tokens

## Backend constraint

UI redesign is frontend-led. Seller auth, CORS (`ALLOWED_ORIGINS`), and related API integrations remain required for production.
