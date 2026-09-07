# Famous Hardware, Kodinhi

Full-stack e-commerce platform for a hardware / sanitary / lighting store, built with the MERN stack.

## Folder Structure

```
website/
├── backend/                   Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/           auth, product, category, coupon, cart, order
│   ├── middleware/            verifyToken, isAdmin, error handling
│   ├── models/                User, Category, Product, Coupon, Cart, Order
│   ├── routes/
│   ├── utils/                 JWT + cookie helpers
│   └── server.js
└── frontend/                  React (Vite) + Tailwind CSS
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── routes/ProtectedRoute.jsx
        ├── components/{layout,product,auth,admin}/
        └── pages/{...,admin/}
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, a strong JWT_SECRET, and your Cloudinary credentials
npm run dev
```

Runs on `http://localhost:5000`.

### Cloudinary (product image uploads)

Variant images in the admin panel are uploaded directly to Cloudinary via `POST /api/upload/images` (admin-only, up to 3 files, 5MB each). Create a free account at [cloudinary.com](https://cloudinary.com), grab your **Cloud Name**, **API Key**, and **API Secret** from the dashboard, and set them in `backend/.env`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Uploads land in the `famous-hardware/products` folder in your Cloudinary media library.

**Note on orders:** `createOrder` uses a MongoDB transaction (`session.startTransaction()`), which requires MongoDB to be running as a replica set (Atlas clusters are replica sets by default; a local standalone `mongod` is not). For local standalone development, either run `mongod --replSet rs0` and initiate it once with `rs.initiate()`, or simplify `orderController.js` to skip the session/transaction.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` calls to the backend (see `vite.config.js`).

## Creating the first admin user

There's no public "become admin" endpoint by design. After registering a normal account, promote it manually:

```js
// mongosh
use famous-hardware
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Seeding categories

Create the three core categories once via the admin-only endpoint (requires an admin JWT cookie, e.g. through the browser after logging in as admin, or via curl with `-b cookies.txt`):

```bash
curl -X POST http://localhost:5000/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Hardware"}' -b cookies.txt
curl -X POST http://localhost:5000/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Sanitary"}' -b cookies.txt
curl -X POST http://localhost:5000/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Lightings"}' -b cookies.txt
```

## Key design notes

- **Auth**: unified login issues a JWT stored in an `httpOnly`, `sameSite`, `secure`-in-production cookie (never `localStorage`), so it's inaccessible to XSS. `verifyToken`/`isAdmin` middleware protect admin routes; role-based redirect happens client-side using the `redirectTo` the login endpoint returns.
- **Pricing**: `Product.finalPrice` = `basePrice` minus `discountPercentage`, recomputed on every save via a `pre('validate')` hook. Each variant's price is `basePrice + variant.additionalPrice`, then the same discount is applied (`Product.getVariantPrice`).
- **Coupons**: `Coupon.calculateDiscount` handles both percentage and flat discounts, respects `minOrderValue` and an optional `maxDiscountAmount` cap, and `isValidNow()` checks active flag, date window, and usage limit.
- **Variants**: modeled as an embedded array on `Product` rather than a separate collection, since variants have no independent lifecycle outside their parent product; each variant carries its own SKU, stock, price delta and images.
