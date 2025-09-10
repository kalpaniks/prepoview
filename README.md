# Prepoview – Share private repos, read‑only

Prepoview lets you share time‑boxed, read‑only access to your private GitHub repositories without adding collaborators. Enforce expiration and view limits; no downloads.

- Encrypted OAuth tokens at rest – never stored in plaintext
- Viewer sessions validated on every request; instant revoke
- Read‑only GitHub access – no writes, no clone/archives

## Self Hosting

For better privacy and security you can always self host this repository.

## Tech stack

- Next.js (App Router), React 19, TypeScript
- NextAuth + Prisma (PostgreSQL)
- Tailwind v4 + Shadcn
- Monaco Editor

## Getting started

Requirements:

- Node 18+ and pnpm
- PostgreSQL database
- GitHub OAuth App (Client ID/Secret)

1. Install deps

```bash
pnpm install
```

2. Configure environment
   Create `.env.local` with:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# GitHub OAuth App
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/prepoview
DIRECT_URL=postgresql://user:pass@localhost:5432/prepoview

# Encryption (64 hex chars for AES-256-GCM)
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

3. Generate client & run migrations

```bash
pnpm db:generate
pnpm db:migrate
```

4. Start the app

```bash
pnpm dev
# http://localhost:3000
```

## OAuth scopes & security

See detailed policy in `/legal` (Terms, Privacy, Permissions).

## Project structure

```
app/                # App Router pages & API routes
components/         # UI and features (editor, share, landing)
hooks/              # React Query hooks
lib/                # auth, crypto, prisma, API helpers
prisma/             # Prisma schema & migrations
services/           # Service-layer helpers
utils/              # Share utilities
```

## Scripts

```bash
pnpm dev            # start dev server
pnpm build          # build
pnpm start          # start production server
pnpm db:generate    # prisma generate
pnpm db:migrate     # migrate dev
pnpm db:studio      # prisma studio
pnpm lint           # lint
pnpm format         # format with prettier
```

## Contributing

Contributions are welcome! Please:

- Open an issue for discussion / proposal
- Keep PRs focused and well‑described
- Match existing code style (see ESLint/Prettier configs)

### Development guidelines

- Favor server‑side validation for access control (expiry/limits)
- Avoid duplicating business rules across endpoints
- Never log secrets; prefer explicit error messages
- Keep components accessible and keyboard‑friendly

## License

MIT © {2025} Prepoview contributors
