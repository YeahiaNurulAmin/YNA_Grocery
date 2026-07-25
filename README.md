# 🛒 YNA Grocery — Full-Stack E-Commerce & Marketplace Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.3-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Groq AI](https://img.shields.io/badge/Groq-AI%20SDK-f55036?logo=openai&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A production-grade, full-stack MERN e-commerce application featuring dual Customer & Seller portals, real-time Socket.io order sync, Stripe payments, Cloudinary media storage, Groq AI shopping assistance, coupon discount engine, and HTTP-only JWT security.

---

## 🌟 Executive Summary & Key Highlights

**YNA Grocery** is a modern, high-performance grocery e-commerce platform and marketplace management suite. It delivers a fast, responsive storefront for shoppers alongside a comprehensive management console for store administrators and sellers.

### 🔑 Key Engineering & Architectural Features:
* **Dual-Portal Architecture**: Separate, optimized SPA workflows for storefront shopping (`/`) and seller/admin management (`/seller`).
* **⚡ Real-Time Socket.io Synchronization**: Instant cross-client updates for orders across admin screens (`/seller/orders`, `/seller/dashboard`, `/seller/history`) and customer tracking views (`/my-orders`). Includes instant audio chimes and toast alerts upon order placement (COD or Stripe webhook confirmation).
* **🤖 Groq AI Shopping Assistant**: Integrated AI assistant powered by Groq SDK to assist customers with product recommendations, order queries, and customizable system prompt controls for sellers with rate-limiting abuse guards.
* **💳 Stripe Payments & Webhooks**: Integrated payment flow featuring Cash on Delivery (COD) and automated Stripe Checkout with raw-body signature verification for `checkout.session.completed` events.
* **🎟️ Coupon & Discount Management**: Dynamic coupon engine supporting fixed and percentage-based discounts with minimum order validation, real-time active status toggles, and client cart application.
* **🖼️ Profile & Cloudinary Media Upload**: Direct user and product image uploads validated for file type/size and saved to Cloudinary.
* **🔒 Enterprise Security & Auth**: **HTTP-only JWT cookies** (protecting against XSS), bcrypt password hashing, input validation, and ownership validation (`req.userId` check).
* **🎨 Modern Design System**: Responsive design system built with Tailwind CSS v4, Lucide Icons, glassmorphism UI elements, dark/light theme options, and mobile-friendly bottom navigation.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies & Dependencies |
| :--- | :--- |
| **Frontend** | React 19.2, Vite 7.2, Socket.io Client 4.8, Tailwind CSS v4.1 (`@tailwindcss/vite`), React Router v7.1, Axios 1.14, Lucide React 1.24, React Hot Toast 2.6, Styled Components 6.3 |
| **Backend API** | Node.js (v18+), Express 5.2, Socket.io Server 4.8, Mongoose ODM 9.3, JWT (`jsonwebtoken` 9.0), BcryptJS 3.0, Multer 2.1, Cookie Parser 1.4, Cors 2.8 |
| **Real-Time Engine** | WebSockets & Socket.io (Bi-directional real-time order notifications and status updates) |
| **Database** | MongoDB Atlas / Local MongoDB Document Database |
| **Cloud & External APIs**| **Cloudinary** (Image Optimization & Storage)<br> **Stripe** (Payments & Raw Webhooks)<br> **GroqCloud AI** (LLM Shopping Assistance) |

---

## 🚀 Core Functionality & Features

### 🛍️ Customer Storefront
* **Product Discovery**: Multi-attribute search, category navigation, dynamic sorting (price, popularity), and instant availability status.
* **Interactive Cart & Coupons**: Persistent database cart syncing, real-time calculation of subtotal, delivery charges, and coupon discount validation.
* **Checkout Workflows**:
  * **Cash on Delivery (COD)**: Instant order placement.
  * **Stripe Online Payment**: Secure session checkout with automatic webhook order status confirmation.
* **User Profile Suite (`/profile`)**:
  * **Personal Information**: Edit display name, phone number, and avatar upload (Cloudinary).
  * **Address Book**: Manage multiple delivery addresses with ownership checks.
  * **Order History**: Track past order statuses (*Order Placed, Packing, Shipped, Out for delivery, Delivered, Cancelled*).
  * **Security**: Account password update with current password validation.
* **Wishlist & Recently Viewed**: Saved items and local browsing context tracking.
* **AI Shopping Assistant**: Floating storefront AI assistant powered by Groq to guide buyers.

### 🏪 Seller & Admin Dashboard (`/seller`)
* **Analytics & Overview**: Sales metric cards, revenue statistics, live order counters, and inventory alerts.
* **Product Catalog**: Add, update, delete, and toggle in-stock status for products with multi-image Cloudinary uploads.
* **Real-Time Order Processing**: Immediate order sync across dashboard tabs with audio chimes and toast alerts. Update order statuses with instant updates pushed to the buyer.
* **Coupon & Discount Suite**: Create discount codes (Percentage/Fixed), set minimum order amounts, toggle active status, and delete expired codes.
* **AI Assistant Prompt Control**: View, edit, or reset the custom system prompt driving the storefront AI assistant.
* **Notification System**: Notification drawer and audio chime settings for incoming orders.

---

## 📁 Project Architecture

```
YNA_Grocery/
├── client/                         # Frontend SPA (React 19 + Vite + Tailwind CSS v4)
│   ├── design/                     # Interactive design specs & UI tokens
│   ├── public/                     # Static public assets & favicon
│   └── src/
│       ├── assets/                 # Branding logos, icons, default product images
│       ├── components/             # Navbar, Footer, ChatBot, Modals, Loading spinners
│       ├── configs/                # Axios instance & global configuration
│       ├── context/                # AppContext (Auth, Cart, Products, Socket connection)
│       ├── pages/                  # Storefront Routes
│       │   ├── About.jsx           # Store background & mission
│       │   ├── AddAddress.jsx      # Address creation form
│       │   ├── AllProducts.jsx     # Full product catalog & filter search
│       │   ├── Cart.jsx            # Shopping cart & coupon checkout flow
│       │   ├── Contact.jsx         # Support & contact details
│       │   ├── FAQ.jsx             # Frequently Asked Questions
│       │   ├── Home.jsx            # Landing page hero & categories
│       │   ├── MyOrder.jsx         # Customer order tracking page
│       │   ├── NotFound.jsx        # 404 Error page
│       │   ├── Privacy.jsx         # Privacy policy guidelines
│       │   ├── ProductCategory.jsx # Category specific catalog view
│       │   ├── ProductDetails.jsx # Detailed product page
│       │   ├── Profile.jsx         # Profile settings, addresses, avatar upload
│       │   ├── RecentlyViewed.jsx  # Recently viewed items
│       │   ├── SearchResults.jsx   # Dedicated search output page
│       │   ├── Terms.jsx           # Terms of service
│       │   ├── Wishlist.jsx        # Saved wishlist items
│       │   └── seller/             # Seller Administration Suite
│       │       ├── AddProduct.jsx  # Catalog addition form with Multer uploads
│       │       ├── Coupons.jsx     # Coupon creation & status management
│       │       ├── Dashboard.jsx   # Analytics overview & order stats
│       │       ├── EditProduct.jsx # Existing product editor
│       │       ├── OrderHistory.jsx# Completed & archived orders
│       │       ├── OrdersList.jsx  # Live active orders table
│       │       ├── ProductsList.jsx# Manage in-stock & item catalog
│       │       ├── Seller.jsx      # Admin layout container & sidebar
│       │       ├── SellerNotifications.jsx # Order alert history
│       │       ├── SellerProfile.jsx# Seller credentials & details
│       │       └── SellerSettings.jsx# AI assistant prompt controls & sounds
│       └── utils/                  # Client utility helpers
└── server/                         # Backend RESTful API (Express 5 + Node.js)
    ├── configs/                    # MongoDB connection, Cloudinary SDK, Socket.io, Multer
    ├── controllers/                # Controller Business Logic
    │   ├── addressController.js    # Address CRUD
    │   ├── cartController.js       # Cart state operations
    │   ├── chatController.js       # Groq AI & prompt settings
    │   ├── couponController.js     # Coupon creation, validation & toggling
    │   ├── orderController.js      # COD, Stripe payment & status update handlers
    │   ├── productController.js    # Product catalog management
    │   ├── sellerController.js     # Seller authentication & session
    │   └── userController.js       # Registration, login, profile & password security
    ├── middlewares/                # Authentication & Guard Middlewares
    │   ├── authSeller.js           # Admin/Seller JWT verification
    │   ├── authUser.js             # Customer JWT verification
    │   └── chatAbuseGuard.js       # Concurrency & rate-limiter for Groq AI
    ├── models/                     # Mongoose Schemas (User, Address, Product, Order, Coupon, ChatSettings)
    ├── routes/                     # Express API Routers
    └── utils/                      # Password helpers & utility routines
```

---

## 📡 API Reference Overview

### 👤 User Authentication & Profile (`/api/users`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register a new customer account |
| `POST` | `/api/users/login` | Public | Authenticate user & set HTTP-only JWT cookie |
| `GET` | `/api/users/is-auth` | Auth (`authUser`) | Verify current authentication session |
| `GET` | `/api/users/logout` | Auth (`authUser`) | Invalidate session & clear HTTP-only cookie |
| `PUT` | `/api/users/profile` | Auth (`authUser`) | Update profile details and avatar image via Multer/Cloudinary |
| `PUT` | `/api/users/change-password` | Auth (`authUser`) | Update password with existing password verification |

### 🏪 Seller Management (`/api/seller`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/seller/login` | Public | Authenticate seller/admin credentials |
| `GET` | `/api/seller/is-auth` | Seller (`authSeller`) | Verify seller session |
| `GET` | `/api/seller/logout` | Seller (`authSeller`) | Log out seller & clear auth cookies |

### 📦 Product Catalog (`/api/products`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/list` | Public | Retrieve active product catalog |
| `GET` | `/api/products/id` | Public | Fetch detailed information for a single product |
| `POST` | `/api/products/add` | Seller (`authSeller`) | Create new product with Cloudinary image upload |
| `PUT` | `/api/products/update` | Seller (`authSeller`) | Modify product information and images |
| `DELETE` | `/api/products/delete` | Seller (`authSeller`) | Remove product from catalog |
| `PUT` | `/api/products/stock` | Seller (`authSeller`) | Toggle product in-stock availability |

### 🛒 Cart & Delivery Address (`/api/cart` & `/api/address`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/cart/update` | Auth (`authUser`) | Sync shopping cart items with user account |
| `GET` | `/api/address/get` | Auth (`authUser`) | Fetch user's saved shipping addresses |
| `POST` | `/api/address/add` | Auth (`authUser`) | Add new delivery address |
| `POST` | `/api/address/update` | Auth (`authUser`) | Modify existing shipping address |
| `DELETE` | `/api/address/delete` | Auth (`authUser`) | Remove shipping address |

### 💳 Orders & Payments (`/api/order` & `/verify-payment`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/order/cod` | Auth (`authUser`) | Place order with Cash on Delivery |
| `POST` | `/api/order/online` | Auth (`authUser`) | Initialize Stripe Checkout session |
| `GET` | `/api/order/user` | Auth (`authUser`) | Fetch logged-in user order history |
| `GET` | `/api/order/seller` | Seller (`authSeller`) | Fetch all customer orders for seller management |
| `POST` | `/api/order/status` | Seller (`authSeller`) | Update order processing state & push Socket event |
| `POST` | `/verify-payment` | Stripe Webhook | Raw-body webhook verification (`checkout.session.completed`) |

### 🎟️ Coupons & Discounts (`/api/coupons`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/coupons/add` | Seller (`authSeller`) | Create a new promotional discount coupon |
| `GET` | `/api/coupons/list` | Seller (`authSeller`) | Retrieve all store coupons |
| `DELETE` | `/api/coupons/delete/:id` | Seller (`authSeller`) | Delete a coupon |
| `PATCH` | `/api/coupons/toggle/:id` | Seller (`authSeller`) | Toggle active/inactive coupon status |
| `POST` | `/api/coupons/validate` | Public | Validate coupon code against cart total at checkout |

### 🤖 AI Storefront Assistant (`/api/chat`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Public (`chatAbuseGuard`) | Customer chat query to Groq AI agent |
| `GET` | `/api/chat/prompt` | Seller (`authSeller`) | Fetch current AI system prompt |
| `PUT` | `/api/chat/prompt` | Seller (`authSeller`) | Update AI system prompt |
| `POST` | `/api/chat/prompt/reset` | Seller (`authSeller`) | Reset AI prompt to default configuration |

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local MongoDB server or MongoDB Atlas URI)
* Cloudinary Account (Cloud Name, API Key, API Secret)
* Stripe Account (API Secret Key, Webhook Signing Secret)
* GroqCloud Account (API Key for Groq AI)

---

### 1. Backend Configuration

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/yna_grocery
JWT_SECRET=your_super_secret_jwt_key
ALLOWED_ORIGINS=http://localhost:5173

# Admin / Seller Credentials
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=your_seller_password

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Chatbot (GroqCloud)
GROQ_API_KEY=gsk_...
```

Start the backend development server:
```bash
npm run server   # Launches server with Nodemon on http://localhost:4000
```

---

### 2. Frontend Configuration

Navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=$
```

Start the frontend client:
```bash
npm run dev      # Launches Vite dev server at http://localhost:5173
```

To test production build locally:
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Best Practices

* **HTTP-Only Cookie Tokens**: Session authentication utilizes `httpOnly`, `sameSite`, and `secure` cookies to protect against XSS attack vectors.
* **Raw Body Webhook Parsing**: Stripe webhooks bypass standard JSON body parsers to evaluate raw signatures (`stripe.webhooks.constructEvent`).
* **Input Validation & File Filtering**: File upload routes use Multer validation restricting MIME types (`image/*`) and enforcing strict size limits (5MB).
* **Object Ownership Guards**: User resource operations (addresses, profile, orders) validate ownership using decoded JWT claims (`req.userId`).
* **AI Rate Limiting & Abuse Prevention**: Storefront chat endpoints enforce request concurrency controls and rate limiting via `chatAbuseGuard`.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
