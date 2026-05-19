# YNA Grocery

YNA Grocery is a modern, fully-featured, full-stack e-commerce web application designed for a seamless grocery shopping experience. It offers a robust user interface for customers to browse products, manage their shopping carts, and securely checkout using online payments or cash on delivery. It also includes seller capabilities to manage the catalog.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) stored in HTTP-only cookies, with password hashing via `bcryptjs`.
- **Product Catalog**: Browse fresh produce, dairy, bakery items, instant food, and more. Features dynamic categories and search functionality.
- **Shopping Cart**: Add, remove, and update quantities of items. Cart state is synchronized with the backend database.
- **Secure Checkout & Payments**: 
  - Integrated with **Stripe** for secure online payments.
  - Implements Stripe Webhooks for asynchronous payment verification.
  - Supports **Cash on Delivery (COD)**.
- **Order Management**: Users can view their order history and track order statuses.
- **Seller/Admin Dashboard**: Secure endpoints for managing the product catalog and tracking all orders.
- **Cloud Media Storage**: Product images are uploaded and served securely via **Cloudinary**.
- **Responsive UI**: Fully responsive and modern design optimized for both mobile and desktop screens using **Tailwind CSS**.

---

## 🛠 Technology Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) powered by [Vite](https://vitejs.dev/) for lightning-fast development and optimized builds.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling and [styled-components](https://styled-components.com/) for component-scoped CSS.
- **Routing**: `react-router-dom` for seamless Single Page Application (SPA) navigation.
- **State Management**: React Context API (`AppContext`).
- **HTTP Client**: `axios` (configured to send credentials for secure sessions).
- **Notifications**: `react-hot-toast` for elegant, non-blocking user alerts.

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (RESTful API architecture).
- **Database**: [MongoDB](https://www.mongodb.com/) object modeling via [Mongoose](https://mongoosejs.com/).
- **Authentication & Security**: `jsonwebtoken` (JWT), `bcryptjs`, and `cookie-parser`.
- **Payment Processing**: `stripe` SDK for creating checkout sessions and handling webhooks.
- **File Uploads**: `multer` for multipart form data and `cloudinary` for cloud-based image storage.
- **Middleware**: `cors` for Cross-Origin Resource Sharing.

---

## 💻 Installation & Setup

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)
- Stripe Account (for payment processing)
- Cloudinary Account (for image hosting)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd YNA_Grocery
```

### 2. Setup the Backend
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory. You will need to configure variables for your Port, Database URI, JWT Secret, Cloudinary keys, and Stripe keys.

Start the backend server (runs on `http://localhost:4000` by default):
```bash
# For development with auto-restart
npm run server 

# For production
npm run start
```

### 3. Setup the Frontend
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory and configure your backend URL (e.g., `VITE_BACKEND_URL`).

Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 🌐 API Architecture (Highlights)

- **`/api/users`**: Handles user authentication (`/register`, `/login`, `/logout`, `/is-auth`).
- **`/api/products`**: Product management (`/list`, `/add`, `/update`, `/delete`, `/id`).
- **`/api/cart`**: Manages the user's shopping cart state (`/update`).
- **`/api/order`**: Checkout and order history (`/cod`, `/online`, `/user`, `/seller`).
- **`/verify-payment`**: Stripe webhook endpoint for processing `checkout.session.completed` events securely.

---

## 💡 Key Development Highlights
- **Stripe Webhook Integration**: Implemented raw body parsing specifically for the `/verify-payment` route to ensure Stripe signature verification operates correctly before standard JSON parsing is applied to other routes.
- **Secure Sessions**: Transitioned away from client-side token storage (like localStorage) to secure, HTTP-only cookies to mitigate XSS attacks.
- **Protected Routes**: Custom authentication middleware protects sensitive routes like viewing user orders and placing checkouts, preventing Insecure Direct Object References (IDOR).
