# 🛒 YNA Grocery — Full-Stack E-Commerce & Marketplace Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, full-stack MERN e-commerce application featuring dual Customer & Seller portals, real-time Socket.io order sync, Stripe payments, Cloudinary media storage, Groq AI shopping assistance, and robust HTTP-only JWT security.

---

## 🌟 Executive Summary & Key Highlights

**YNA Grocery** is a production-ready, full-stack grocery e-commerce and marketplace platform designed to deliver an exceptional shopping experience for customers and a comprehensive management dashboard for sellers.

### 🔑 Key Engineering & Architectural Features:
* **Dual-Portal Architecture**: Separate, highly optimized SPA routes for customer shopping and seller/admin administration.
* **⚡ Real-Time Socket.io Order Sync**: Instant, zero-reload order updates across the admin dashboard (`/seller/orders`, `/seller/dashboard`, `/seller/history`) and customer order views. Instant audio chimes & toast notifications alert admins immediately when any order is placed (COD or Stripe webhook confirmed).
* **User Profile & Media Upload Engine**: Rich user profile management supporting direct device image uploads validated for file type/size and stored on **Cloudinary**.
* **Enterprise Security & Auth**: **HTTP-only JWT cookies** (preventing XSS access), bcrypt password hashing, input validation (`runValidators`), authorization guards, and rate-limited password reset flows via **Resend**.
* **Stripe Checkout & Webhook Integration**: Complete checkout workflow supporting Cash on Delivery (COD) and automated Stripe payment processing with raw-body webhook signature verification (`checkout.session.completed`).
* **Groq AI Shopping Assistant**: Integrated AI agent powered by Groq (`openai/gpt-oss-20b`) for instant customer support, item suggestions, and custom prompt management for sellers.
* **State-of-the-Art Design System**: Custom design tokens (built with Tailwind CSS v4 and Google Fonts), dark/light theme switching, responsive touch-friendly mobile bottom navigation, and micro-interactions.

---

## 🛠️ Tech Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 19, Vite, Socket.io Client, Tailwind CSS v4, React Router v7, Axios, Lucide Icons, React Hot Toast |
| **Backend API** | Node.js, Express 5, Socket.io Server, Mongoose ODM, JWT Authentication, Multer, Express Rate Limit |
| **Real-Time Messaging** | WebSockets & Socket.io (Bi-directional real-time order events & status push notifications) |
| **Database** | MongoDB (Atlas / Local Document Store) |
| **Cloud Services** | Cloudinary (Image Optimization & Storage), Stripe (Payments & Webhooks), Resend (Email Delivery), GroqCloud AI |

---

## 🚀 Core Functionality & Features

### 🛍️ Customer Storefront
* **Product Discovery**: Real-time multi-attribute search, category filtering, and price/popularity sorting.
* **Interactive Shopping Cart**: Dynamic cart quantity updates, real-time total & tax calculations, and persistent database syncing.
* **User Profile Center (`/profile`)**:
  * **Personal Information**: Edit display name, phone number, and avatar.
  * **Cloudinary Image Upload**: Direct local device image upload with client-side preview, MIME validation, and size checks.
  * **Address Book**: Manage multiple delivery addresses with ownership validation (`req.userId`).
  * **Order History**: Track past order statuses, amounts, and item details.
  * **Account Security**: Secure password update flow with current password verification.
* **Wishlist & Recently Viewed**: Saved items and recent browsing history.
* **Checkout & Payments**: Address selection, Cash on Delivery, and instant Stripe Checkout.
* **AI Chat Assistant**: Built-in floating AI assistant to answer product queries and assist shoppers.

### 🏪 Seller & Admin Dashboard (`/seller`)
* **Analytics & Overview**: Sales metric cards, recent order stream, and stock status alerts with live order counters.
* **Product Catalog Management**: Add, update, delete, and toggle in-stock statuses with multi-image Cloudinary uploads.
* **Real-Time Order Management**: Process incoming orders with zero manual reloads. Orders update automatically live via WebSockets (Socket.io) when customers place COD or online orders. Update order delivery states (*Order Placed, Packing, Shipped, Out for delivery, Delivered, Cancelled*) with instant cross-client synchronization.
* **Promotions & Coupons**: Create, enable/disable, and delete promotional discount codes.
* **Notification System**: Real-time push notification sounds (audio chime), toast popups, notification drawer, and admin settings.

---

## 📁 Project Architecture

```
YNA_Grocery/
├── client/                     # Frontend SPA (React 19 + Vite)
│   ├── design/                 # Design system specs & interactive board
│   └── src/
│       ├── assets/             # Branding logo, icons, default product assets
│       ├── components/         # Reusable UI primitives, Navbar, Footer, ChatBot
│       ├── context/            # Global AppContext (Auth, Cart, Products, Axios defaults)
│       ├── pages/              # Storefront & Seller routes (Profile, Cart, MyOrder, etc.)
│       └── utils/              # Client-side utility functions
└── server/                     # Backend RESTful API (Express 5 + Node.js)
    ├── configs/                # Database connection, Cloudinary SDK, Multer upload limits
    ├── controllers/            # Controller logic (Auth, User Profile, Products, Orders, Address, Chat)
    ├── middlewares/            # JWT Auth guards (authUser, authSeller), Abuse/Rate Limiters
    ├── models/                 # Mongoose schemas (User, Address, Product, Order, Coupon, ChatSettings)
    ├── routes/                 # Express API routes
    └── utils/                  # Resend email service & password validation helpers
```

---

## 📡 API Reference Overview

### 👤 User & Profile Endpoints (`/api/users`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register new customer account |
| `POST` | `/api/users/login` | Public | Authenticate user & issue HTTP-only JWT cookie |
| `GET` | `/api/users/is-auth` | Auth (`authUser`) | Verify authentication status & load user state |
| `GET` | `/api/users/logout` | Auth (`authUser`) | Clear auth cookie and invalidate session |
| `PUT` | `/api/users/profile` | Auth (`authUser`) | Update name, phone, and upload profile avatar to Cloudinary |
| `PUT` | `/api/users/change-password` | Auth (`authUser`) | Change password with current password verification |
| `POST` | `/api/users/forgot-password` | Public (Rate-Limited) | Send password reset token link via Resend email |
| `POST` | `/api/users/reset-password` | Public (Rate-Limited) | Reset password using one-time token |

### 📍 Address Endpoints (`/api/address`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/address/get` | Auth (`authUser`) | Fetch user's saved shipping addresses |
| `POST` | `/api/address/add` | Auth (`authUser`) | Create a new delivery address |
| `POST` | `/api/address/update` | Auth (`authUser`) | Update an existing address (verified with `userId`) |
| `DELETE` | `/api/address/delete` | Auth (`authUser`) | Delete address (verified with `userId`) |

### 📦 Product & Order Endpoints (`/api/products` & `/api/order`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/list` | Public | Get all active catalog products |
| `POST` | `/api/products/add` | Seller (`authSeller`) | Add product with Cloudinary image upload |
| `PUT` | `/api/products/update` | Seller (`authSeller`) | Update product details and images |
| `DELETE` | `/api/products/delete` | Seller (`authSeller`) | Remove product from catalog |
| `GET` | `/api/order/user` | Auth (`authUser`) | Fetch logged-in user order history |
| `POST` | `/api/order/seller` | Seller (`authSeller`) | Get orders assigned to seller |
| `POST` | `/verify-payment` | Webhook (Stripe) | Stripe webhook verification (`checkout.session.completed`) |

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* Cloudinary API Keys
* Stripe API Secret Key
* Resend API Key
* GroqCloud API Key

---

### 1. Backend Setup

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

# Email Service (Resend)
RESEND_API_KEY=re_...
SENDER_EMAIL=onboarding@resend.dev

# AI Chatbot (GroqCloud)
GROQ_API_KEY=gsk_...
GROQ_MODEL=openai/gpt-oss-20b
```

Run the backend server:
```bash
npm run server   # Launches development server with Nodemon
```

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=$
```

Launch the frontend client:
```bash
npm run dev      # Runs Vite dev server at http://localhost:5173
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Best Practices

* **HTTP-Only Cookies**: Authentication tokens are stored in `httpOnly`, `sameSite`, and `secure` cookies to eliminate XSS vulnerability risks.
* **Input Validation & Sanitization**: Image uploads are validated for MIME type (`image/*`) and capped at **5MB** via Multer middleware. Database updates strictly enforce `runValidators: true`.
* **Ownership Checks**: Address and User endpoints explicitly verify object ownership using decoded JWT claims (`req.userId`).
* **Rate Limiting**: Password reset and public endpoints feature IP-based rate limiting to protect against brute-force attacks.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
