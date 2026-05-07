# Frontend Tasks — Email Sender

Stack: Next.js · Redux Toolkit · RTK Query · React Hook Form · Yup · Lucide Icons · Framer Motion · Tailwind CSS · shadcn/ui · NextAuth

---

## Milestone 1 — Project Setup & Auth Shell

### Project Scaffolding

- [x] Init Next.js app (App Router) with TypeScript inside `email-sender-frontend/`
- [x] Install and configure Tailwind CSS and shadcn/ui (init, add base components)
- [x] Install all dependencies: Redux Toolkit, RTK Query, React Hook Form, Yup, Lucide React, Framer Motion, NextAuth
- [x] Set up Redux store with `configureStore`, wrap app in `Provider`
- [x] Configure RTK Query `baseQuery` pointing to backend API URL (from env `NEXT_PUBLIC_API_URL`)
- [x] Create `.env.local` template with `NEXT_PUBLIC_API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [x] Set up path aliases (`@/` → `src/`)

### NextAuth Session

- [x] Configure NextAuth with a Credentials provider — call backend `/auth/login`, receive `accessToken` + user payload, store in JWT callback
- [x] Extend NextAuth `Session` and `JWT` types to include `accessToken`, `role`, `id`, `name`, `email`
- [x] Configure `session.maxAge` to 3600s (60 min), enable `updateAge` to slide on activity
- [x] Write `withAuth` proxy (`proxy.ts`) to redirect unauthenticated users to `/login` for all protected routes (note: Next.js 16 uses `proxy.ts` not `middleware.ts`)
- [x] Write `RoleGuard` client component that checks `session.user.role === 'super_admin'` and renders a 403 fallback for Super Admin-only pages

### Auth Pages

- [x] **Login page** (`/login`): React Hook Form + Yup schema (email required, password min 6), shadcn `Input`/`Button`, inline error message on 401, redirect to `/dashboard` on success via `signIn()`, Framer Motion fade-in on mount
- [x] **Forgot Password page** (`/forgot-password`): email field form, call RTK Query mutation `POST /auth/forgot-password`, show success state ("Check your email") after submit
- [x] **Reset Password page** (`/reset-password?token=…`): new password + confirm password fields with Yup `.oneOf()` match, call `POST /auth/reset-password` with token from query param, redirect to `/login` on success

### App Shell & Navigation

- [x] Create root authenticated layout (`/app/(dashboard)/layout.tsx`) with sidebar navigation
- [x] Sidebar links: Dashboard, Templates, Users (only visible when `role === 'super_admin'`)
- [x] Add user avatar/name in sidebar footer with a Sign Out button (`signOut()`)
- [x] Add Framer Motion `AnimatePresence` page transition wrapper in the root layout

---

## Milestone 2 — Layout Blueprint Components ✅

- [x] Create `LayoutAPreview` component (`components/layouts/LayoutAPreview.tsx`) — inline styles only
- [x] Create `LayoutBPreview` component (`components/layouts/LayoutBPreview.tsx`) — inline styles only
- [x] Both use inline-CSS (email-client safe, no Tailwind)
- [x] `PreviewFrame` with Desktop / Mobile toggle, Framer Motion animation on resize

---

## Milestone 2 — Templates ✅

### RTK Query API Slice

- [x] `templatesApi` — getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate, getTemplateSendHistory, createSend
- [x] Bearer token attached via `prepareHeaders`

### Templates Library Page (`/templates`) ✅

- [x] Paginated card grid, action menu (Edit, Duplicate, Delete, Send)
- [x] Debounced search (300ms), layout filter dropdown
- [x] "New Template" button
- [x] Delete confirmation via `AlertDialog`, cache invalidation on success
- [x] Framer Motion stagger animation

### Template Editor ✅

- [x] Layout selector step (new flow), skip on edit
- [x] Two-panel: form left, live preview right (updates on `useWatch`)
- [x] Layout A + Layout B form fields (all fields per spec)
- [x] Yup validation schemas per layout
- [x] Save → createTemplate/updateTemplate, toast, navigate to detail page

### Template Detail Page (`/templates/[id]`) ✅

- [x] Header with name, layout badge, meta info
- [x] Edit, Duplicate, Delete, Send action bar
- [x] Preview + Send History tabs
- [x] Send history table with status badges

### Send Drawer ✅

- [x] Tag-input for multiple recipients, subject pre-filled
- [x] Validation: min 1 recipient, valid email format
- [x] POST /sends on confirm, success toast

---

## Milestone 3 — Dashboard (`/dashboard`) ✅

### RTK Query API Slice ✅

- [x] dashboardApi — stats, activity, layout-split, top-templates, recent-sends, user-activity

### Dashboard Page ✅

- [x] Metric cards (Total / This Month / Today) with skeleton loaders
- [x] Stacked bar chart (recharts) — Layout A + B per day over 30 days
- [x] Donut chart — layout split
- [x] Top 5 templates ranked list
- [x] Recent sends table with status badges
- [x] User Activity section (Super Admin only, user dropdown filter)

---

## Milestone 4 — User Management (`/users`) ✅

### RTK Query API Slice ✅

- [x] usersApi — getUsers, getUserById, createUser, updateUser, suspendUser, reactivateUser, deleteUser, resetUserPassword

### Users List Page (`/users`) ✅

- [x] Table with role/status badges, last active, actions menu
- [x] Debounced search, role + status filter dropdowns
- [x] Pagination controls
- [x] Create User button, action menu (Edit, Suspend/Reactivate, Reset Password, Delete)
- [x] Protected by `RoleGuard`

### Create / Edit User Form ✅

- [x] Name, Email, Role fields with Yup validation
- [x] Create: success toast "Invite email sent"
- [x] Edit: loads existing values, updateUser on save
- [x] Last Super Admin demotion error surfaced inline
- [x] shadcn `Sheet` slide-in panel

---

## Shared / Cross-Cutting ✅

- [x] Global Sonner toasts (success, error) wired to all mutations
- [x] `ErrorBoundary` component wrapping page content
- [x] `PageLoader`, `CardSkeleton`, `TableSkeleton` used during isFetching states
- [x] Responsive sidebar collapses to hamburger `Sheet` at `md` breakpoint
- [x] `validationMessages.ts` — centralized Yup error strings
- [x] `animations.ts` — fadeIn, slideIn, stagger, pageTransition variants
