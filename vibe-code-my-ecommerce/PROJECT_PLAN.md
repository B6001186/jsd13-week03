# D2C Bookstore - Project Plan

> A direct-to-consumer bookstore for authors to sell books directly to readers without middlemen.

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Backend  | Node.js + Express.js                |
| Database | MongoDB Atlas + Mongoose ODM        |
| Auth     | JWT (JSON Web Token)                |
| Frontend | Plain HTML / CSS / JavaScript       |
| Mobile   | React (Phase 2 - not yet created)  |

---

## Project Structure

```
vibe-code-my-ecommerce/
├── PROJECT_PLAN.md
├── README.md
├── .gitignore
└── app/
    ├── api/                    # Backend (Express.js)
    │   ├── .env
    │   ├── package.json
    │   ├── src/
    │   │   ├── server.js
    │   │   ├── config/
    │   │   │   └── db.js             # MongoDB connection
    │   │   ├── middleware/
    │   │   │   └── auth.js           # JWT verify middleware
    │   │   ├── models/
    │   │   │   ├── User.js
    │   │   │   ├── Product.js
    │   │   │   ├── Order.js
    │   │   │   ├── Address.js
    │   │   │   ├── Payment.js
    │   │   │   └── Status.js
    │   │   ├── routes/
    │   │   │   ├── auth.routes.js
    │   │   │   ├── product.routes.js
    │   │   │   ├── order.routes.js
    │   │   │   ├── address.routes.js
    │   │   │   ├── payment.routes.js
    │   │   │   └── admin.routes.js
    │   │   └── controllers/
    │   │       ├── auth.controller.js
    │   │       ├── product.controller.js
    │   │       ├── order.controller.js
    │   │       ├── address.controller.js
    │   │       ├── payment.controller.js
    │   │       └── admin.controller.js
    │   └── uploads/                  # Slip images
    │
    ├── web/                    # Frontend (HTML/CSS/JS)
    │   ├── index.html                # Home / Product Showcase
    │   ├── css/
    │   │   └── style.css
    │   ├── js/
    │   │   ├── api.js                # API helper functions
    │   │   ├── auth.js               # Login/Register logic
    │   │   ├── cart.js               # Shopping cart logic
    │   │   ├── checkout.js           # Payment page logic
    │   │   └── admin.js              # Admin dashboard logic
    │   ├── pages/
    │   │   ├── login.html
    │   │   ├── register.html
    │   │   ├── cart.html
    │   │   ├── checkout.html
    │   │   ├── order-history.html
    │   │   ├── order-tracking.html
    │   │   ├── support.html
    │   │   └── admin/
    │   │       ├── dashboard.html
    │   │       ├── orders.html
    │   │       ├── inventory.html
    │   │       └── shipping.html
    │   └── assets/
    │       └── images/
    │
    └── mobile/                 # React App (Phase 2)
```

---

## MongoDB Collections & Schemas

### 1. users

```js
{
  _id: ObjectId,
  name: String,           // required
  email: String,          // required, unique
  password: String,       // hashed with bcrypt
  tel: String,
  address_id: ObjectId,   // ref -> addresses
  role: String,           // "customer" | "admin"
  created_at: Date,
  updated_at: Date
}
```

### 2. products

```js
{
  _id: ObjectId,
  product_name: String,   // required
  caption: String,        // description / tagline
  pics_urls: [String],    // array of image URLs
  price: Number,          // required, THB
  inventory: Number,      // stock count
  is_active: Boolean,     // show/hide product
  created_at: Date,
  updated_at: Date
}
```

### 3. orders

```js
{
  _id: ObjectId,
  user_id: ObjectId,      // ref -> users
  items: [
    {
      product_id: ObjectId,  // ref -> products
      quantity: Number,
      price_at_purchase: Number  // snapshot price at time of order
    }
  ],
  total_amount: Number,
  shipping_address: {
    details: String,
    subdistrict: String,
    district: String,
    province: String,
    zip_code: String
  },
  tracking_number: String,    // filled when shipped
  status_id: ObjectId,        // ref -> statuses
  created_at: Date,
  updated_at: Date
}
```

### 4. addresses

```js
{
  _id: ObjectId,
  user_id: ObjectId,      // ref -> users
  details: String,        // house number, street
  subdistrict: String,
  district: String,
  province: String,
  zip_code: String,
  is_default: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### 5. payments

```js
{
  _id: ObjectId,
  order_id: ObjectId,     // ref -> orders
  method: String,         // "QR_PromptPay" | "bank_transfer"
  amount_paid: Number,
  slip_url: String,       // uploaded slip image path
  verified: Boolean,      // admin confirms payment
  created_at: Date,
  updated_at: Date
}
```

### 6. statuses (reference data)

```js
{
  _id: ObjectId,
  status_name: String,    // unique key
  description: String
}
```

**Default statuses:**

| status_name          | description       |
| -------------------- | ----------------- |
| pending_payment      | รอการชำระเงิน      |
| paid                 | ชำระเงินแล้ว        |
| preparing_shipment   | เตรียมจัดส่ง         |
| shipped              | จัดส่งแล้ว           |
| delivered            | ได้รับสินค้าแล้ว     |

---

## API Endpoints

### Auth

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | /api/auth/register   | Register new user   | No            |
| POST   | /api/auth/login      | Login, return JWT   | No            |
| GET    | /api/auth/me         | Get current user    | Yes           |

### Products

| Method | Endpoint                | Description              | Auth Required |
| ------ | ----------------------- | ------------------------ | ------------- |
| GET    | /api/products           | List all products        | No            |
| GET    | /api/products/:id       | Get single product       | No            |
| POST   | /api/products           | Create product           | Admin         |
| PUT    | /api/products/:id       | Update product           | Admin         |
| DELETE | /api/products/:id       | Delete product           | Admin         |

### Orders

| Method | Endpoint                  | Description              | Auth Required |
| ------ | ------------------------- | ------------------------ | ------------- |
| GET    | /api/orders               | List user's orders       | Yes           |
| GET    | /api/orders/:id           | Get order detail         | Yes           |
| POST   | /api/orders               | Create new order         | Yes           |
| PUT    | /api/orders/:id/tracking  | Update tracking number   | Admin         |
| PUT    | /api/orders/:id/status    | Update order status      | Admin         |

### Addresses

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | /api/addresses        | List user addresses | Yes           |
| POST   | /api/addresses        | Add address         | Yes           |
| PUT    | /api/addresses/:id    | Update address      | Yes           |
| DELETE | /api/addresses/:id    | Delete address      | Yes           |

### Payments

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | ------------- |
| POST   | /api/payments/upload  | Upload slip                | Yes           |
| GET    | /api/payments/:orderId| Get payment for order       | Yes           |
| PUT    | /api/payments/:id/verify | Admin verify payment    | Admin         |

### Admin

| Method | Endpoint                    | Description              | Auth Required |
| ------ | --------------------------- | ------------------------ | ------------- |
| GET    | /api/admin/dashboard        | Summary stats            | Admin         |
| GET    | /api/admin/orders           | All orders with filters  | Admin         |
| PUT    | /api/admin/orders/:id       | Update order status      | Admin         |

---

## Web Pages (Frontend)

| Page               | Path                         | Description                        |
| ------------------ | ---------------------------- | ---------------------------------- |
| Home               | /index.html                  | Product showcase (all books)       |
| Login              | /pages/login.html            | User login form                    |
| Register           | /pages/register.html         | Registration form                  |
| Cart               | /pages/cart.html             | Shopping cart                      |
| Checkout           | /pages/checkout.html         | Payment (QR + slip upload)         |
| Order History      | /pages/order-history.html    | Past orders list                   |
| Order Tracking     | /pages/order-tracking.html   | Track shipment status              |
| Support            | /pages/support.html          | Help / FAQ                         |
| Admin Dashboard    | /pages/admin/dashboard.html  | Summary overview                   |
| Admin Orders       | /pages/admin/orders.html     | Manage all orders                  |
| Admin Inventory    | /pages/admin/inventory.html  | Manage stock                       |
| Admin Shipping     | /pages/admin/shipping.html   | Print shipping labels              |

---

## Development Phases

### Phase 1: Backend API (Start Here)

- [ ] 1.1  Initialize Express.js project + install dependencies
- [ ] 1.2  Setup MongoDB Atlas connection
- [ ] 1.3  Create Mongoose models (User, Product, Order, Address, Payment, Status)
- [ ] 1.4  Build Auth routes (register, login, JWT middleware)
- [ ] 1.5  Build Product routes (CRUD)
- [ ] 1.6  Build Order routes (create, list, update status)
- [ ] 1.7  Build Address routes (CRUD)
- [ ] 1.8  Build Payment routes (upload slip, verify)
- [ ] 1.9  Build Admin routes (dashboard stats, order management)
- [ ] 1.10 Seed initial data (statuses, admin user, sample products)

### Phase 2: Frontend Web

- [ ] 2.1  Create base HTML layout + CSS
- [ ] 2.2  Build Product Showcase (home page)
- [ ] 2.3  Build Register & Login pages
- [ ] 2.4  Build Shopping Cart page
- [ ] 2.5  Build Checkout / Payment page
- [ ] 2.6  Build Order History & Tracking pages
- [ ] 2.7  Build Support page
- [ ] 2.8  Build Admin Dashboard & Management pages

### Phase 3: Mobile (React)

- [ ] 3.1  Initialize React project
- [ ] 3.2  Reuse API from Phase 1
- [ ] 3.3  Build mobile UI

---

## Dependencies

### Backend (api/package.json)

```json
{
  "name": "d2c-bookstore-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

## .env Variables

```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/d2c-bookstore
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

---

## Notes

- Slip upload: use Multer to store images in `api/uploads/`
- All prices in THB (Thai Baht)
- All-inclusive pricing: shipping cost included in book price
- Password must be hashed with bcrypt before saving
- JWT token sent in response body, client stores in localStorage
- Admin role: only one admin account (the author) - seeded in database
