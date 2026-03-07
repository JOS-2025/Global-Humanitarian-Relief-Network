<<<<<<< HEAD
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
=======
# Global Humanitarian Relief Network (GHRN)
> Production-grade humanitarian donation & transparency platform

[![CI](https://github.com/your-org/ghrn/actions/workflows/ci.yml/badge.svg)](...)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Table of Contents
1. [Architecture Overview](#architecture)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-setup)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Security Checklist](#security)
10. [Contributing](#contributing)

---

## Architecture Overview <a name="architecture"></a>

```
┌─────────────────────────────────────────────────────────────┐
│  Cloudflare CDN / WAF                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼────────┐                  ┌─────────▼───────┐
│  Next.js 14    │                  │  NestJS API      │
│  (Vercel)      │◄────REST/JSON───►│  (AWS ECS)       │
│  Frontend      │                  │  Port 3001        │
└────────────────┘                  └─────────┬────────┘
                                              │
                          ┌───────────────────┼───────────────┐
                          │                   │               │
                 ┌────────▼──────┐  ┌─────────▼────┐  ┌──────▼──────┐
                 │  PostgreSQL   │  │  Redis        │  │  AWS S3     │
                 │  (AWS RDS)    │  │  (ElastiCache)│  │  (Storage)  │
                 └───────────────┘  └──────────────┘  └─────────────┘
```

**Request flow:**
`Browser → Cloudflare → Vercel (Next.js SSR) → NestJS API → PostgreSQL / Redis / S3`

**Payment flow:**
`Browser → Stripe.js → Stripe API → Webhook → NestJS → PostgreSQL`

---

## Folder Structure <a name="folder-structure"></a>

```
ghrn/
│
├── apps/
│   ├── web/                          # Next.js 14 frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── campaigns/
│   │   │   │   │   ├── page.tsx      # Campaign listing
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Campaign detail (SSR)
│   │   │   │   ├── transparency/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── how-it-works/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── apply/
│   │   │   │       └── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── verify-email/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── donor/
│   │   │   │   │   ├── page.tsx          # Donor dashboard
│   │   │   │   │   ├── donations/page.tsx
│   │   │   │   │   ├── saved/page.tsx
│   │   │   │   │   └── receipts/page.tsx
│   │   │   │   ├── ngo/
│   │   │   │   │   ├── page.tsx          # NGO dashboard
│   │   │   │   │   ├── campaigns/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   │   └── [id]/page.tsx
│   │   │   │   │   ├── reports/page.tsx
│   │   │   │   │   ├── withdrawals/page.tsx
│   │   │   │   │   └── analytics/page.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── page.tsx          # Admin dashboard
│   │   │   │       ├── ngos/page.tsx
│   │   │   │       ├── campaigns/page.tsx
│   │   │   │       ├── transactions/page.tsx
│   │   │   │       ├── compliance/page.tsx
│   │   │   │       ├── audit-log/page.tsx
│   │   │   │       └── withdrawals/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardSidebar.tsx
│   │   │   ├── campaigns/
│   │   │   │   ├── CampaignCard.tsx
│   │   │   │   ├── CampaignGrid.tsx
│   │   │   │   ├── CampaignFilters.tsx
│   │   │   │   └── ProgressBar.tsx
│   │   │   ├── donation/
│   │   │   │   ├── DonationForm.tsx
│   │   │   │   ├── AmountSelector.tsx
│   │   │   │   └── PaymentMethod.tsx
│   │   │   ├── charts/
│   │   │   │   ├── GrowthChart.tsx
│   │   │   │   ├── AllocationPieChart.tsx
│   │   │   │   └── LiveLedger.tsx
│   │   │   └── common/
│   │   │       ├── AnimatedCounter.tsx
│   │   │       ├── VerifiedBadge.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCampaigns.ts
│   │   │   ├── useDonation.ts
│   │   │   └── useTransparency.ts
│   │   ├── lib/
│   │   │   ├── api-client.ts         # Axios instance
│   │   │   ├── stripe.ts             # Stripe.js client
│   │   │   ├── utils.ts
│   │   │   └── validations.ts        # Zod schemas
│   │   ├── stores/
│   │   │   └── auth.store.ts         # Zustand
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── public/
│   │   │   ├── sitemap.xml
│   │   │   └── robots.txt
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   ├── redis/
│       │   │   ├── redis.module.ts
│       │   │   └── redis.service.ts
│       │   ├── config/
│       │   │   ├── app.config.ts
│       │   │   └── database.config.ts
│       │   ├── auth/
│       │   │   ├── auth.module.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── auth.controller.ts
│       │   │   ├── strategies/
│       │   │   │   ├── jwt.strategy.ts
│       │   │   │   └── google.strategy.ts
│       │   │   ├── guards/
│       │   │   │   ├── jwt-auth.guard.ts
│       │   │   │   └── roles.guard.ts
│       │   │   ├── decorators/
│       │   │   │   └── current-user.decorator.ts
│       │   │   └── dto/
│       │   │       ├── register.dto.ts
│       │   │       └── login.dto.ts
│       │   ├── users/
│       │   ├── ngo/
│       │   ├── campaigns/
│       │   ├── donations/
│       │   ├── payments/
│       │   ├── transparency/
│       │   ├── admin/
│       │   ├── storage/
│       │   ├── notifications/
│       │   ├── audit/
│       │   ├── health/
│       │   └── common/
│       │       ├── filters/
│       │       │   └── http-exception.filter.ts
│       │       └── interceptors/
│       │           ├── logging.interceptor.ts
│       │           └── transform.interceptor.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── test/
│       │   ├── auth.e2e-spec.ts
│       │   ├── campaigns.e2e-spec.ts
│       │   └── donations.e2e-spec.ts
│       ├── Dockerfile
│       ├── nest-cli.json
│       └── tsconfig.json
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml        # Local dev stack
│   │   └── docker-compose.prod.yml
│   ├── aws/
│   │   ├── ecs-task-definition.json
│   │   ├── rds-config.json
│   │   └── cloudwatch-alarms.json
│   └── terraform/                    # (optional IaC)
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Test + lint on PR
│       └── deploy.yml                # Deploy on merge to main
│
├── .env.example
├── package.json                      # Turborepo root
├── turbo.json
└── README.md                         # ← This file
```

---

## Prerequisites <a name="prerequisites"></a>

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.x |
| pnpm | ≥ 9.x |
| Docker & Docker Compose | ≥ 24.x |
| PostgreSQL | ≥ 15 (via Docker) |
| Redis | ≥ 7 (via Docker) |

---

## Local Development Setup <a name="local-setup"></a>

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ghrn.git
cd ghrn

# 2. Install dependencies (monorepo)
pnpm install

# 3. Copy env files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Start infrastructure (Postgres + Redis)
docker-compose -f infra/docker/docker-compose.yml up -d

# 5. Run database migrations + seed
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed

# 6. Start all services (Turborepo)
cd ../..
pnpm dev
```

Services will be available at:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **API Docs (Swagger):** http://localhost:3001/docs
- **Prisma Studio:** `pnpm prisma studio` → http://localhost:5555

---

## Environment Variables <a name="environment-variables"></a>

### `apps/api/.env`
```env
# ── App ─────────────────────────────────
NODE_ENV=development
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000

# ── Database ────────────────────────────
DATABASE_URL=postgresql://ghrn:ghrn_pass@localhost:5432/ghrn_db

# ── Redis ───────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false

# ── JWT ─────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_64_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── OAuth ───────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback

# ── Stripe ──────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── PayPal ──────────────────────────────
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

# ── AWS ─────────────────────────────────
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=ghrn-media-dev

# ── Email (SES / SendGrid) ───────────────
EMAIL_FROM=noreply@ghrn.org
SENDGRID_API_KEY=

# ── Sentry ──────────────────────────────
SENTRY_DSN=
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Database Setup <a name="database"></a>

```bash
cd apps/api

# Run all migrations
pnpm prisma migrate dev --name init

# Generate Prisma client
pnpm prisma generate

# Seed with test data
pnpm prisma db seed

# Open visual browser
pnpm prisma studio

# Reset database (dev only)
pnpm prisma migrate reset
```

### Key indexes provided:
- `users.email` — unique, fast auth lookup
- `campaigns.slug` — unique, used for SSR pages
- `campaigns.status, category, urgency` — filter queries
- `donations.userId, campaignId, createdAt` — dashboard queries
- `transactions.providerTxId` — webhook idempotency
- `audit_logs.action, createdAt` — compliance reporting

---

## API Reference <a name="api-reference"></a>

All routes are prefixed `/api/v1/`. Full interactive docs at `/docs` in dev.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login + JWT |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | JWT | Invalidate refresh token |
| GET | `/auth/verify-email/:token` | Public | Verify email |
| POST | `/auth/2fa/setup` | JWT | Generate TOTP secret |
| POST | `/auth/2fa/confirm` | JWT | Enable 2FA |

### Campaigns
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/campaigns` | Public | List + filter campaigns |
| GET | `/campaigns/:slug` | Public | Campaign detail (SSR) |
| POST | `/campaigns` | NGO | Create campaign |
| PUT | `/campaigns/:id` | NGO | Update campaign |
| PATCH | `/campaigns/:id/approve` | Admin | Approve campaign |
| PATCH | `/campaigns/:id/reject` | Admin | Reject with reason |

### Donations & Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/intent` | JWT | Create Stripe PaymentIntent |
| POST | `/payments/webhook/stripe` | Webhook | Stripe event handler |
| GET | `/donations/me` | JWT | My donation history |
| GET | `/donations/:id/receipt` | JWT | PDF receipt |

### NGO
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ngo/apply` | JWT | Submit NGO application |
| GET | `/ngo/profile` | NGO | Get NGO profile |
| GET | `/ngo/analytics` | NGO | Campaign analytics |
| POST | `/ngo/withdraw` | NGO | Request withdrawal |
| POST | `/ngo/documents` | NGO | Upload compliance doc |

### Transparency (Public)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/transparency/stats` | Public | Platform KPIs |
| GET | `/transparency/ledger` | Public | Public transaction ledger |
| GET | `/transparency/allocations` | Public | Fund allocation records |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Admin | Dashboard metrics |
| GET | `/admin/ngos/pending` | Admin | Pending NGO applications |
| GET | `/admin/campaigns/pending` | Admin | Pending campaigns |
| GET | `/admin/audit-log` | Admin | Full audit trail |
| GET | `/admin/compliance-alerts` | Admin | Open compliance alerts |
| PATCH | `/admin/users/:id/suspend` | Admin | Suspend user |
| PATCH | `/admin/ngo/:id/freeze` | Admin | Freeze NGO account |
| PATCH | `/admin/withdrawals/:id` | Admin | Approve/reject withdrawal |

---

## Deployment <a name="deployment"></a>

### Docker (local / staging)

```bash
# Build API image
docker build -t ghrn-api ./apps/api

# Run full stack
docker-compose -f infra/docker/docker-compose.prod.yml up -d
```

### `infra/docker/docker-compose.yml`
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ghrn_db
      POSTGRES_USER: ghrn
      POSTGRES_PASSWORD: ghrn_pass
    ports: ['5432:5432']
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
    command: redis-server --appendonly yes

  api:
    build: ./apps/api
    env_file: ./apps/api/.env
    ports: ['3001:3001']
    depends_on: [postgres, redis]
    command: >
      sh -c "npx prisma migrate deploy && node dist/main.js"

volumes:
  postgres_data:
```

### `apps/api/Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### GitHub Actions CI/CD — `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env: { POSTGRES_DB: test, POSTGRES_USER: test, POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_HOST: localhost

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker build -t ghrn-api ./apps/api
          docker tag ghrn-api:latest $ECR_REGISTRY/ghrn-api:latest
          docker push $ECR_REGISTRY/ghrn-api:latest
          aws ecs update-service --cluster ghrn-prod --service ghrn-api --force-new-deployment
        env:
          ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Security Checklist <a name="security"></a>

### Infrastructure
- [x] HTTPS enforced everywhere (Cloudflare → Vercel, Cloudflare → ECS)
- [x] Cloudflare WAF rules enabled
- [x] AWS RDS encryption at rest (AES-256)
- [x] S3 bucket private; all access via signed URLs
- [x] Redis AUTH password set in production
- [x] Secrets in AWS Secrets Manager / GitHub Actions Secrets (never in code)
- [x] VPC with private subnets for RDS and Redis
- [x] Daily automated RDS snapshots (7-day retention)

### Application
- [x] Helmet.js HTTP security headers
- [x] CORS restricted to known origins
- [x] Rate limiting via Redis (100 req/min global, 10/min on auth)
- [x] JWT short-lived (15min) + refresh token rotation
- [x] Password hashing: bcrypt cost factor 12
- [x] 2FA enforced for NGO and Admin roles
- [x] SQL injection prevention via Prisma parameterized queries
- [x] Input validation + whitelist via class-validator
- [x] XSS protection: `whitelist: true` in ValidationPipe
- [x] Stripe webhook signature verification (constructEvent)
- [x] Idempotency keys on all payment operations
- [x] File upload: type + size validation before S3
- [x] Immutable audit logs (insert-only, no update/delete)
- [x] CSRF: SameSite cookies + Origin header check

### Compliance
- [x] All financial actions written to `audit_logs`
- [x] NGO KYC/AML document collection enforced
- [x] Bank account micro-deposit verification before disbursement
- [x] Suspicious activity flagged to `compliance_alerts`
- [x] GDPR: user data deletion endpoint (`DELETE /users/me`)
- [x] PCI DSS: card data never touches our servers (Stripe.js)

---

## Contributing <a name="contributing"></a>

1. Branch from `develop`: `git checkout -b feat/your-feature`
2. Write tests for new features
3. Ensure `pnpm lint && pnpm test` passes
4. Open a PR against `develop`
5. Production deployments go through `main` only

---

## License

MIT © GHRN Organization
>>>>>>> origin/main
