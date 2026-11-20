# Beep Fresher Jobs - Frontend

React + Vite + TypeScript frontend for the fresher/internship jobs aggregator.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:28081` (Spring Boot)

## Setup

```bash
cd beep-fresher-frontend
npm install
```

## Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | (empty — uses Vite proxy) |

In development, Vite proxies `/api` to `http://localhost:28081` automatically.

## Run

```bash
# Dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Tech Stack

- React 18 + TypeScript (strict)
- Vite
- TanStack Query v5
- React Router v6
- Tailwind CSS
- lucide-react
- Vitest + React Testing Library

## Folder Structure

```
src/
├── lib/              # theme, api client, types, utils
├── components/       # shared UI components
│   ├── layout/       # Header, Footer
│   ├── common/       # Avatar, RoleChip, CityChip, ApplyButton
│   └── jobs/         # JobCard, JobGrid, JobSkeleton, EmptyState, ErrorState, FilterChips, Pager
├── features/jobs/    # jobs feature
│   ├── hooks/        # useJobs
│   └── components/   # JobDetailDrawer, JobNotFound
├── pages/            # HomePage, JobDetailPage, NotFoundPage
└── App.tsx
```

## Accessibility

- Semantic HTML throughout
- Visible focus rings on all interactive elements
- ARIA labels on buttons and controls
- Escape key closes drawer/sheet
- Color contrast AA in both light and dark themes
- Respects `prefers-reduced-motion`

## What to Expect After Running

1. Open `http://localhost:5174/` (or the port shown in terminal)
2. **Health check:** `http://localhost:5174/api/health` → `{"status":"ok"}`
3. **Jobs list:** `http://localhost:5174/` → job cards with search, filters, pagination
4. **Job detail:** Click any card → detail drawer slides in (desktop) or sheet (mobile)
5. **Deep link:** Navigate directly to `http://localhost:5174/jobs/1`
6. **Apply:** Click "Apply" on any card → opens the original listing in a new tab

## Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

Test coverage includes:
- `JobCard.test.tsx` - Card rendering, null fields, HTML-as-text, click/keyboard
- `EmptyState.test.tsx` - Empty states, clear filters
- `ErrorState.test.tsx` - Error display, retry button
- `useJobs.test.ts` - API calls, slow-load timer, refetch
- `utils.test.ts` - Relative time and absolute date formatting
