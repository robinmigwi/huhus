# Huhu's Ordering Demo

A customer-side menu and ordering experience prototype for Huhu's Pizza & Grill.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Demo scope

- Browse and search the menu by category.
- Select pizza sizes and coffee options.
- Add products to a cart and adjust quantities.
- Choose delivery or collection and enter sample checkout details.
- Generate a simulated order confirmation.

**Demo-only:** checkout does not take payments, transmit orders to Huhu's, send messages, or store customer details. Prices and offers are transcribed from the supplied Huhu's website content and menu artwork for demonstration, not independently verified as current.

## Deployment

Cloudflare Pages project: `huhus-ordering-demo`  
Production branch for this isolated demo project: `demo/huhus-ordering`  
Build command: `npm run build`  
Build output: `dist`
