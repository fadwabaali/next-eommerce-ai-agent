# orne — AI-Powered Fashion E-Commerce Platform

**Live site:** [ornestyle-one.vercel.app](https://ornestyle-one.vercel.app/)

*Everyday, elevated.* — A modern, minimal fashion storefront selling clothes, shoes, jewelry, and accessories, built with an AI shopping assistant and a fully headless CMS backend.

---

## ✨ Overview

**orne** is a full-stack, production-quality e-commerce platform combining a premium editorial design with modern web architecture. It features real-time content management, secure payments, persistent cart state, and an AI-powered shopping assistant that can search products, recommend items, and track orders on behalf of authenticated users.

---

## 🛍️ Features

### Customer
- Browse products by category — Clothes, Shoes, Jewelry, Accessories
- Product search & filtering
- Detailed product pages with variants and stock status
- Persistent shopping cart (Zustand + localStorage)
- Secure checkout with Stripe
- Automatic order creation & stock management via Stripe webhooks
- Order history and individual order tracking
- Clerk-based authentication (sign up / sign in / user profile)
- AI Shopping Assistant — product search, recommendations, and order tracking via natural language

### Admin
- Sanity Studio–powered product & content management
- Order management and sales statistics
- AI-generated business insights and sales trend analysis

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| CMS | Sanity CMS, Sanity Studio, Sanity Live, Sanity App SDK, GROQ, Sanity TypeGen |
| Auth | Clerk (+ AgentKit) |
| Payments | Stripe (Checkout + Webhooks) |
| State | Zustand with localStorage persistence |
| AI | Vercel AI SDK, Vercel AI Gateway (Claude, GPT, Cohere) |
| UI | shadcn/ui, Tailwind CSS v4 |
| Hosting | Vercel |

---

## 🎨 Design Direction

orne's visual identity is built around a warm, neutral, editorial aesthetic:

- **Typography:** Serif display headlines paired with a clean sans-serif for UI text
- **Palette:** Warm cream backgrounds, deep burgundy accents, natural browns and taupe tones
- **Layout:** Minimal, generous whitespace, mobile-first and fully responsive
- **Components:** shadcn/ui as the functional foundation, customized to match brand identity
- **Dark mode:** Supported via theme toggle

---

## 🗂️ Project Structure (high level)

```
orne/
├── app/                  # Next.js App Router routes
│   ├── (store)/          # Storefront pages (home, category, product, cart, checkout)
│   ├── (auth)/            # Clerk sign-in / sign-up
│   ├── (account)/        # Order history, order details
│   ├── admin/             # Admin dashboard
│   ├── api/               # Route handlers (Stripe webhooks, AI endpoints)
│   └── studio/             # Embedded Sanity Studio
├── components/            # Reusable UI + shadcn components
├── lib/                    # Sanity client, Stripe client, AI tools, utils
├── store/                  # Zustand cart store
├── sanity/                 # Sanity schemas & config
└── types/                  # Generated & shared TypeScript types
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

AI_GATEWAY_API_KEY=
```

---

## 🔒 Security

- Server-side Stripe webhook signature verification
- Idempotent order creation to prevent duplicate charges
- User-scoped order access (users can only view their own orders)
- AI tool calls are authenticated and authorized via Clerk before accessing user data
- Secret keys are never exposed to the client

---

## 📦 Deployment

Deployed on **Vercel**, with production configuration for Sanity, Stripe (live keys + webhooks), Clerk, and the Vercel AI Gateway.

---

## 📄 License

This is a personal/student project built for learning purposes, inspired by a public tutorial but implemented with original design, branding, and architectural improvements.

© 2026 orne. All rights reserved.