# Portfolio & Blog

A modern portfolio and blog website built with Vite, React, TypeScript, shadcn/ui, Supabase, and Stripe.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Bundler:** Vite (SWC)
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Backend / Auth / DB:** Supabase
- **Payments:** Stripe
- **Routing:** React Router DOM v6
- **Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env` and fill in your keys:
```bash
cp .env .env.local
```

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── integrations/
│   └── supabase/     # Supabase client & types
├── lib/
│   └── utils.ts      # Utility functions
├── pages/            # Route-level page components
├── App.tsx
├── main.tsx
└── index.css         # Global styles + Tailwind + CSS vars
```
