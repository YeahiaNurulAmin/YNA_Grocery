# YNA Grocery — UI/UX Designer Brief

> Design reference for recreating the UI while keeping the existing color system and product features.
>
> **Source of truth for colors:** `client/src/index.css` (Tailwind v4 `@theme`)
>
> **Stack:** React SPA (`client`) · Express REST API (`server`) · MongoDB · Stripe · Cloudinary · Tailwind CSS

---

## App overview

Online grocery storefront + seller/admin dashboard.

| Role | How authenticated | Access |
|------|-------------------|--------|
| **Customer (User)** | Email/password → JWT cookie (`token`) | Browse, cart, checkout, addresses, order history |
| **Seller / Admin** | Env credentials → JWT cookie (`sellerToken`) | Product CRUD, orders, coupons, notifications |
| **Guest** | None | Browse/search products, add to cart locally; checkout requires login |

There is no separate “admin” vs “seller” role — the seller dashboard greets as **“Hi! Admin”**.

---

## Features by area

### Customer storefront

| Page | Route | What it does |
|------|-------|--------------|
| Home | `/` | Hero, categories, best sellers, value props, newsletter, footer |
| All Products | `/products` | Full catalog + navbar search filter |
| Category | `/products/:category` | Products in one category |
| Product Details | `/products/:category/:id` | Gallery, price, rating, add/buy, related products |
| Cart | `/cart` | Line items, address, tax (15%), COD or Stripe |
| Add Address | `/add-address` | Shipping address form |
| My Orders | `/my-orders` | Order history |
| Loader | `/loader` | Post-payment redirect splash |

**7 categories:**

1. Organic veggies
2. Fresh Fruits
3. Cold Drinks
4. Instant Food
5. Dairy Products
6. Bakery & Breads
7. Grains & Cereals

**Auth:** Login/register modal (email + password). Guests can browse and cart; checkout needs login.

#### Home page sections

1. **MainBanner** — hero image, headline, CTAs (Shop Now / Explore deals)
2. **Categories** — 7 category tiles
3. **BestSeller** — first in-stock products as cards
4. **BottomBanner** — “Why We Are The Best” value props
5. **NewsLetter** — email + Subscribe
6. **Footer** — brand, social, quick links

#### Global chrome

- **Navbar** — logo, Home, All Product, Contact, search, cart badge, Login / profile menu
- **Footer** — on all non-seller routes
- **Toasts** — `react-hot-toast`

---

### Cart / checkout / orders

#### Cart

- Line items: image, name, weight, qty, subtotal, remove
- Empty state with Continue Shopping
- Order Summary: delivery address, payment method
- Pricing: items + free shipping + **15% tax** + total
- Payment methods: **Cash On Delivery** · **Online Payment (Stripe)**

#### Checkout flows

1. Select address → Place Order (COD) → clear cart → `/my-orders`
2. Online → Stripe Checkout → webhook verify → `/loader?next=...` → My Orders

#### Addresses

- Form fields: first/last name, email, street, city, state, zip, country, phone
- Cart can list saved addresses and add new

#### Order statuses (seller-managed)

`Order Placed` → `Packing` → `Shipped` → `Out for delivery` → `Delivered` · or `Cancelled`

---

### Seller / Admin dashboard

| Page | Route | What it does |
|------|-------|--------------|
| Seller Login / Add Product | `/seller` | Login gate, then create product |
| Products List | `/seller/products` | Stock toggle, edit, delete |
| Edit Product | `/seller/update-product/:id` | Update product |
| Orders | `/seller/orders` | Active orders + status updates |
| Order History | `/seller/history` | Delivered/cancelled + search/sort/stats |
| Coupons | `/seller/coupons` | Create/manage promo codes |

#### Seller shell

- Top bar: logo, “Hi! Admin”, dark mode toggle, notification bell, Logout
- Sidebar: Add Product, Products, Orders, History, Coupons
- Live notifications: polls orders; toast + chime for new “Order Placed”

#### Add / Edit Product

- Up to 4 images, name, description, category, price, offer price

#### Active Orders

- Filter tabs: All / Placed / Packing / Shipped / Out for Delivery
- Cards: items, address, amount, method, date, paid/pending, status dropdown

#### Order History

- Delivered + Cancelled only
- Search, sort, stats (Delivered count, Cancelled count, Revenue)

#### Coupons

- Create: code, % or flat discount, min order, expiry
- Enable/disable, delete; Active / Inactive / Expired badges

---

### Incomplete / placeholder (flag for redesign)

| Item | Status |
|------|--------|
| Contact page | Linked but no route/page |
| Footer help links (FAQs, Delivery Info, etc.) | Placeholder `#` URLs |
| Forgot password | UI only — not wired |
| Newsletter Subscribe | UI only — no API |
| Seller Sign up toggle | UI only — login-only backend |
| Coupon apply in cart | API exists; not used in Cart UI |
| Address edit/delete | API exists; customer UI only supports add |

---

## Key user flows

```
Browse Home → Category / All Products / Search
    → Product Card or Product Details → Add to Cart / Buy Now
        → Cart → (login if needed) → Select/Add Address
            → COD: Place Order → My Orders
            → Online: Stripe → Loader → My Orders

Seller: /seller login → Add/Edit products → Manage stock
    → Orders (update status) → History / Coupons
```

---

## Color system (keep these)

### Brand

| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#22c55e` | Main brand green — CTAs, logo, focus rings |
| Primary dark | `#16a34a` | Hover / darker green |
| Primary light | `#4ade80` | Light green accents |
| Accent | `#ff6b35` | Orange — nav links, badges, energy |
| Accent dark | `#ff5722` | Darker orange / social icons |
| Accent light | `#ff8a65` | Lighter orange / hover |

**Gradients:**

- Primary: `linear-gradient(135deg, #22c55e 0%, #16a34a 100%)`
- Accent: `linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)`
- Fresh: `linear-gradient(135deg, #e8f5e9 0%, #fff3e0 100%)`

---

### Backgrounds (light)

| Token | Hex |
|-------|-----|
| White | `#ffffff` |
| Cream | `#fafaf9` |
| Light mint | `#e8f5e9` |
| Soft peach | `#fff3e0` |

### Backgrounds (dark mode)

| Token | Hex |
|-------|-----|
| White (surface) | `#1e293b` |
| Cream | `#0f172a` |
| Light mint | `#1e3a29` |
| Soft peach | `#2d1f0f` |

---

### Text (light → dark)

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#1e293b` | `#f1f5f9` |
| Secondary | `#475569` | `#cbd5e1` |
| Tertiary | `#64748b` | `#94a3b8` |
| Placeholder | `#94a3b8` | `#64748b` |

### Neutral scale

| Token | Light | Dark |
|-------|-------|------|
| dark | `#1e293b` | `#f1f5f9` |
| gray-800 | `#475569` | `#cbd5e1` |
| gray-600 | `#64748b` | `#94a3b8` |
| gray-400 | `#94a3b8` | `#475569` |
| gray-300 | `#cbd5e1` | `#334155` |
| gray-100 | `#f8fafc` | `#1e293b` |

---

### Borders

| Token | Light | Dark |
|-------|-------|------|
| Border | `#cbd5e1` | `#334155` |
| Border light | `#e2e8f0` | `#1e293b` |

---

### Semantic

| Token | Hex | Notes |
|-------|-----|-------|
| Success | `#22c55e` | Same as primary |
| Warning | `#f59e0b` | |
| Error | `#ef4444` | |
| Info | `#3b82f6` | |

---

### Category pastels

| Category | Hex |
|----------|-----|
| Organic veggies | `#FEF6DA` |
| Fresh Fruits | `#FEE0E0` |
| Cold Drinks | `#F0F5DE` |
| Instant Food | `#E1F5EC` |
| Dairy Products | `#FEE6CD` |
| Bakery & Breads | `#E0F6FE` |
| Grains & Cereals | `#F1E3F9` |

---

### Typical usage patterns

| Surface | Pattern |
|---------|---------|
| Primary button | Green fill (`#22c55e`), white text, hover darker green (`#16a34a`) |
| Nav / badges / energy | Orange accent (`#ff6b35`) |
| Add-to-cart | Soft green tint + orange text |
| Auth CTA | Primary green → hover accent orange |
| Footer | White → primary green gradient |
| Overlays (modals) | Black at ~60% opacity |

**Font:** Open Sans (global). Outfit is imported but not applied.

---

### Designer notes

1. **Official palette = green + orange + slate** from `@theme` in `index.css`.
2. Prefer aligning all new work to **`#22c55e`** + **`#ff6b35`**.
3. Some older icons still use legacy mint **`#4FBF8B`** / **`#4CB08A`** — treat as tech debt; do not introduce more of these.
4. Semantic tokens exist; some UI still uses raw Tailwind red/green/amber/blue.
5. Seller admin leans more on slate/gray defaults than brand tokens — redesign can unify this.
6. No separate JS theme object; Tailwind v4 CSS variables are the design system.

---

## Component map (key pages)

| Page | Main sections / components |
|------|----------------------------|
| Home | MainBanner, Categories, BestSeller, BottomBanner, NewsLetter |
| All / Category | Title + ProductCard grid |
| Product Details | Breadcrumbs, gallery, info/CTAs, Related Products |
| Cart | Line list + Order Summary sidebar (or empty state) |
| Add Address | Form + illustration |
| My Orders | Order cards |
| Seller shell | Top nav + sidebar + Outlet |
| Coupons | Create form + coupons table |
