# MoneyMap 💰

MoneyMap is a full-stack personal finance tracker that helps users manage income, expenses, budgets, and savings in one place. It includes OTP-based authentication, an admin dashboard, Razorpay-powered, receipt scanning via OCR, and automated daily expense SMS reminders.

## Features

- **Authentication** — Email OTP registration/login (Nodemailer), forgot-password flow, JWT-based sessions, profile management with picture upload (Multer).
- **Income & Expense Tracking** — Add, view, and manage income and expense entries with monthly summaries.
- **Budgeting & Savings** — Set budgets per category and track savings goals.
- **Dashboard** — Visual charts and summaries built with Recharts, plus PDF export of reports (jsPDF).
- **Receipt Scanning (OCR)** — Extract expense data from photographed receipts using Tesseract.js / node-tesseract-ocr.
- **Admin Dashboard** — Separate admin login and view for managing users and platform data.
- **Payments** — Razorpay integration.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS
- Recharts (charts), Lucide/React Icons
- jsPDF + jsPDF-AutoTable (PDF export)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken) for auth
- bcryptjs for password hashing
- Nodemailer (email OTP), Twilio (SMS)
- Razorpay (payments)
- Multer (file uploads)
- Tesseract.js / node-tesseract-ocr (receipt OCR)

## Project Structure

```
moneymap/
├── backend/
│   ├── controller/       # Route handlers (admin, budget, expense, income, login, saving)
│   ├── cron/              # Scheduled jobs (daily expense SMS)
│   ├── middleware/        # Auth middleware (admin route protection)
│   ├── models/             # Mongoose schemas
│   ├── router/              # Express route definitions
│   ├── service/              # Auth/token helpers
│   ├── utils/                 # SMS helper, etc.
│   ├── uploads/                 # Uploaded profile pictures
│   └── index.js                  # Express app entry point
└── frontend/
    ├── public/                # Static assets
    ├── src/
    │   ├── components/         # React components (Dashboard, Login, Register, Budget, etc.)
    │   ├── context/             # Auth context
    │   ├── App.jsx                # App routes
    │   └── main.jsx                 # React entry point
    ├── eslint.config.js       # ESLint configuration
    ├── postcss.config.js      # PostCSS configuration (used by Tailwind)
    ├── tailwind.config.js     # Tailwind CSS configuration
    ├── index.html             # Vite HTML entry point
    └── package.json           # Frontend dependencies/scripts
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB database (local or Atlas)
- Accounts/credentials for: Gmail (for Nodemailer), Twilio (SMS), Razorpay (payments)

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/Vishw203/MoneyMap.git
cd moneymap

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend/` with the following keys:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
secret=your_jwt_secret
key_id=your_razorpay_key_id
key_secret=your_razorpay_key_secret
expected=your_admin_sms_trigger_secret
ADMIN_EMAIL=admin@example.com
SMS_COOLDOWN_HOURS=24
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM=your_twilio_phone_number
TWILIO_MESSAGING_SERVICE_SID=your_twilio_messaging_service_sid
```

### 3. Run the backend

```bash
cd backend
npm start
```

The API will start on the port defined in `PORT` (default `8000`).

### 4. Run the frontend

```bash
cd frontend
npm start
```

This starts the Vite dev server (default `http://localhost:5173`).
