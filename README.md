# Huhu's Digital Ordering & Operations

Customer ordering PWA and staff management dashboard for the Huhu's pilot.

## Routes
- Customer ordering: /
- Staff dashboard: /admin
- Health: GET /api/health
- Catalogue: GET /api/menu
- Submit order: POST /api/orders

## Backend
Cloudflare Pages Functions handle the API. Cloudflare D1 stores menu categories, menu items, staff accounts and sessions, orders, order items, order history, store settings and M-Pesa transaction records. The D1 binding is configured in wrangler.toml as DB. The initial database schema is in migrations/0001_initial.sql.

## Initial owner account
Configure the encrypted Pages production environment variables HUHUS_ADMIN_EMAIL and HUHUS_ADMIN_PASSWORD. The first login bootstraps the owner account. Passwords are salted and hashed with PBKDF2 before storage; staff sessions use server-side records and an HttpOnly Secure cookie.

## Preview mode
The demo_mode setting defaults to true. Customer checkout creates real database records visible in the staff dashboard, but orders are marked as preview orders and are not sent to the restaurant for fulfilment. Keep preview mode enabled until Huhu's team has agreed the behind-the-counter process.

## M-Pesa
A real Daraja OAuth, STK Push and callback implementation is included. It remains disabled in preview mode. For live integration, configure MPESA_ENV (sandbox or production), MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY and MPESA_CALLBACK_SECRET. Optionally configure MPESA_TRANSACTION_TYPE as CustomerPayBillOnline or CustomerBuyGoodsOnline. A successful STK Push response is not treated as payment success; only the Safaricom callback marks an order as paid.

## WhatsApp
No WhatsApp API or automation is connected. The customer PWA includes a scripted chat preview clearly labelled as not connected to WhatsApp.

## Build
Use Node.js 20+, then npm install, npm run dev or npm run build.
