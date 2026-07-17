# YNA Grocery

**Fresh groceries, delivered with care.**

Full-stack grocery e-commerce for customers and sellers. Premium React storefront + Express REST API, MongoDB, Stripe, Cloudinary, and Resend.

---

## Features

### Customer storefront
- Browse categories, search, and **advanced filter / sort** on the products page
- Product details, cart, addresses, COD and **Stripe** checkout
- Order history and responsive mobile bottom navigation
- Auth (login / register) via JWT HTTP-only cookies
- **Forgot / reset password** via Resend email link
- Dark mode, Contact, FAQ, About, Privacy, Terms, Wishlist & Recently Viewed (UI)
- **AI chatbot** (Groq `openai/gpt-oss-20b`) for shopping help and support

### Seller / admin dashboard
- Login with env credentials
- Dashboard overview (stats, recent orders, stock alerts)
- Product CRUD with Cloudinary images
- Active orders + status updates, order history
- Coupons, notifications (live polling), settings & profile UI
- Dark mode

### Design system
- Brand: Primary green `#22c55e`, accent orange `#ff6b35`
- Typography: Manrope (headings) + Inter (body)
- Tokens & components in `client/src/index.css` and `client/src/components/ui`
- Design board: [`client/design/DESIGN_BOARD.html`](client/design/DESIGN_BOARD.html)
- Specs: [`client/design/DESIGN_SYSTEM.md`](client/design/DESIGN_SYSTEM.md)

---

## Tech stack

| Layer | Stack |
|--------|--------|
| **Client** | React 19, Vite, Tailwind CSS v4, React Router, Axios, Lucide, react-hot-toast |
| **Server** | Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer |
| **Data / services** | MongoDB, Cloudinary, Stripe, Groq AI |


---

## Project structure

```
YNA_Grocery/
├── client/                 # React SPA (Vite)
│   ├── design/             # Design board & system docs
│   └── src/
│       ├── assets/         # Images, logo
│       ├── components/     # UI, storefront, seller chrome
│       ├── context/        # AppContext
│       ├── pages/          # Customer + seller routes
│       └── utils/          # Shared client helpers (e.g. password validation)
└── server/                 # Express API
    ├── configs/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    └── utils/              # Email (Resend), password validation
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (online payments)
- Cloudinary account (product images)
- [GroqCloud](https://console.groq.com/) API key (customer chatbot)

---

## Setup

### 1. Clone

```bash
git clone <repository-url>
cd YNA_Grocery
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=your_jwt_secret
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=your_seller_password
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Get a Groq API key from [console.groq.com](https://console.groq.com/). The chatbot uses `openai/gpt-oss-20b` by default.

```bash
npm run server    # nodemon (dev)
# npm start       # production
```

API default: `http://localhost:4000`

### 3. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=$
```

```bash
npm run dev
```

App default: `http://localhost:5173`

```bash
npm run build     # production build
npm run preview   # preview build
```

---

## Main routes

### Customer
| Path | Page |
|------|------|
| `/` | Home |
| `/products` | Catalog (filters & sort) |
| `/products/:category` | Category |
| `/products/:category/:id` | Product details |
| `/cart` | Cart & checkout |
| `/add-address` | Add address |
| `/my-orders` | Orders |
| `/search` | Search results |
| `/contact` `/faq` `/about` `/privacy` `/terms` | Info pages |
| `/loader` | Post-Stripe redirect |
| `/reset-password` | Reset password (token from email link) |

### Seller
| Path | Page |
|------|------|
| `/seller` | Login (guest) / Add product (auth) |
| `/seller/dashboard` | Overview |
| `/seller/products` | Product list |
| `/seller/update-product/:id` | Edit product |
| `/seller/orders` | Active orders |
| `/seller/history` | Order history |
| `/seller/coupons` | Coupons |
| `/seller/notifications` | Notifications |
| `/seller/settings` `/seller/profile` | Account UI |

---

## API overview

| Base | Purpose |
|------|---------|
| `/api/users` | Register, login, logout, auth check, forgot/reset password |
| `/api/seller` | Seller login, logout, auth check |
| `/api/products` | List, add, update, delete, stock, by id |
| `/api/cart` | Update cart |
| `/api/address` | Add / get addresses |
| `/api/order` | COD, online (Stripe), user & seller orders, status |
| `/api/coupons` | List, add, delete, toggle |
| `/api/chat` | Customer chatbot (Groq; message + history); seller prompt GET/PUT/reset |
| `/verify-payment` | Stripe webhook (`checkout.session.completed`) |

### Password reset

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/users/forgot-password` | Body: `{ email }`. Always returns a generic success message. Rate-limited. |
| `POST` | `/api/users/reset-password` | Body: `{ token, password }`. One-time token, 1h expiry. Rate-limited. |

Password rules (client + server): min 8 characters, at least one letter and one number.

---

## Notes

- JWT sessions use **HTTP-only cookies** (not `localStorage`).
- Stripe webhook uses **raw body** parsing on `/verify-payment` before JSON middleware.
- Seller access is gated by `SELLER_EMAIL` / `SELLER_PASSWORD` in env (no email-based seller password reset).
- Tax on cart checkout is **15%** (client-side display; order amounts follow API logic).
- Design tokens live in `client/src/index.css` (`@theme`); keep brand greens/oranges consistent.
- Password reset uses **Resend**. Forgot/reset endpoints are rate-limited (**5 requests / IP / 15 min**, in-memory — suitable for single-instance MVP; use a shared store when scaling).

---

## License

ISC — see package metadata in `server/package.json`.
