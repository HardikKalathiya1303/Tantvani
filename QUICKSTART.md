# Tantvani — Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## Setup

### 1. Configure Backend
Edit `backend/.env` and fill in:
- `MONGO_URI` — Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — From cloudinary.com
- `JWT_SECRET` — Change to a random long string in production

### 2. Seed the Database (First time)
```bash
cd backend
node utils/seed.js
```
This creates:
- Admin account: `admin@tantvani.com` / `Admin@123`
- 6 sample categories

### 3. Start Development Servers

**Terminal 1 — Backend API (port 5000)**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend store (port 5173)**
```bash
cd frontend
npm run dev
```

**Terminal 3 — Admin panel (port 5174)**
```bash
cd admin
npm run dev
```

## URLs
| Service | URL |
|---------|-----|
| Frontend Store | http://localhost:5173 |
| Admin Panel | http://localhost:5174 |
| API | http://localhost:5000/api |

## Admin Login
- URL: http://localhost:5174
- Email: `admin@tantvani.com`
- Password: `Admin@123`

## Project Structure
```
Tantvani/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # DB, Cloudinary config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error handling
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── utils/        # Seed script
├── frontend/         # React store (Vite + Tailwind)
│   └── src/
│       ├── components/   # Navbar, Footer, Home sections
│       ├── pages/        # Home, Collections, Product, Cart, etc.
│       ├── store/        # Zustand state management
│       └── utils/        # Axios instance
└── admin/            # React admin panel (Vite + Tailwind)
    └── src/
        ├── components/   # Sidebar
        ├── pages/        # Dashboard, Products, Categories, Orders, etc.
        └── store/        # Admin auth state
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/products | List products (with filters) |
| GET | /api/products/featured | Featured products |
| GET | /api/products/new-arrivals | New arrivals |
| GET | /api/products/:slug | Product detail |
| GET | /api/categories | All categories |
| POST | /api/orders | Create order (auth) |
| GET | /api/banners | Get banners |
| GET | /api/admin/stats | Dashboard stats (admin) |

## Design System
- **Colors**: Wine red (#411B1E), Gold (#C99B4E), Cream (#FAF1E5)
- **Fonts**: Cormorant Garamond (headings), Jost (UI), Karla (body)
- **Theme**: Historic Indian luxury, inspired by Mughal textile traditions
