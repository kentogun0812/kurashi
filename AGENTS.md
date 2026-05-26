<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Kurashi — AI Agent Rules

> **Project:** Community platform for Vietnamese residents in Japan  
> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base-Nova style, Base-UI) · Supabase (Auth, DB, Storage) · next-intl v4 · Vercel  
> **Locales:** `vi` (default), `en`, `jp`

---

## 1. Architecture & File Conventions

- **App Router only.** All pages live under `src/app/[locale]/`. Never create a `pages/` directory.
- **Route groups:** Use `(public)` for unauthenticated routes, `(protected)` for authenticated routes.
- **Path aliases:** Always use `@/` imports (`@/components`, `@/lib`, `@/services`, `@/i18n`).
- **Component organization:**
  - `src/components/ui/` → Reusable primitives (shadcn/ui). **Never modify generated shadcn files unless fixing a verified bug.**
  - `src/components/<feature>/` → Feature-specific components (e.g., `events/`, `profile/`, `layout/`).
- **Services:** All Supabase data operations go in `src/services/*.service.ts`. Components must NOT call Supabase directly.
- **Middleware:** `src/middleware.ts` handles i18n routing + Supabase session refresh + admin role-gating. Changes here require careful review.

---

## 2. Next.js 16 & React 19 Rules

- **DO** read `node_modules/next/dist/docs/` before using any Next.js API. This version has breaking changes from training data.
- **DO** use React Server Components (RSC) by default. Add `'use client'` only when the component needs browser APIs, hooks, or event handlers.
- **DO** use `generateMetadata()` for dynamic SEO — title, description, and Open Graph per page.
- **DO** use `next/image` with explicit `width`/`height` or `fill` + `sizes` prop. Never omit `sizes` when using `fill`.
- **DON'T** use `getServerSideProps`, `getStaticProps`, or any Pages Router patterns.
- **DON'T** use `asChild` prop on components — Base-UI (used by shadcn v4) does not support it.
- **DON'T** use deprecated Next.js APIs. Check the docs first.

---

## 3. Styling & UI

- **Tailwind CSS 4** with `@import "tailwindcss"` syntax. No `tailwind.config.js` — configuration lives in `globals.css` via `@theme inline`.
- **shadcn/ui** style: `base-nova` using `@base-ui/react` (NOT Radix). Verify component APIs before use.
- **Design tokens:** Use CSS custom properties defined in `:root` / `.dark` (oklch color space). Never hardcode hex/rgb colors.
- **Utilities:** Use the project's custom utilities: `.glass`, `.glow-primary`, `.text-gradient`.
- **Mobile-first:** All layouts must be responsive. Design for mobile viewport first, then scale up.
- **Icons:** Use `lucide-react` exclusively. No other icon library.

---

## 4. Internationalization (i18n)

- **Framework:** `next-intl` v4 with `defineRouting` and `createNavigation`.
- **Supported locales:** `vi` (default), `en`, `jp`. Default locale is `vi`.
- **Message files:** `messages/vi.json`, `messages/en.json`, `messages/jp.json`.
- **Rules:**
  - **DO** use `useTranslations()` in client components and `getTranslations()` in server components.
  - **DO** add keys to ALL three locale files when introducing new UI text.
  - **DO** use `Link` / `useRouter` / `usePathname` / `redirect` from `@/i18n/routing`, NOT from `next/link` or `next/navigation`.
  - **DON'T** hardcode user-facing strings in components. Every visible string must go through i18n, even in Admin screens.
  - **Admin Screens**: For screens under `(protected)/admin`, only declare the i18n message variables in the Vietnamese locale file (`messages/vi.json`), as the admin interface is only accessed in Vietnamese. Do not add them to EN/JP files.
  - **Internal data values** (DB enums, filter keys) must remain in English. Only UI labels are localized.

---

## 5. Supabase & Data Layer

- **Client creation:**
  - Server Components / Route Handlers / Server Actions → `createClient()` from `@/lib/supabase/server`
  - Client Components → `createBrowserClient()` from `@/lib/supabase/client`
  - Middleware → dedicated helper from `@/lib/supabase/middleware`
- **Auth:** Supabase Auth with email/password + OAuth. Session is refreshed in middleware.
- **Storage:** Use Supabase Storage for user-uploaded files (event banners, avatars, listing images). Generate signed URLs server-side.
- **Row Level Security (RLS):** All tables have RLS enabled. Never bypass RLS in client code. If a query fails, check RLS policies first.
- **Rules:**
  - **DO** always call `supabase.auth.getUser()` (not `getSession()`) for server-side auth checks.
  - **DO** handle Supabase errors gracefully — check `{ data, error }` on every query.
  - **DON'T** expose Supabase service role key to the client. It stays in server-only code.
  - **DON'T** write raw SQL in application code. Use the Supabase JS client query builder.
  - **DON'T** modify `database/init.sql` without documenting the migration intent.

---

## 6. Safety & Security

- **Input validation:** Validate and sanitize all user inputs server-side before DB writes. Never trust client-only validation.
- **Auth gating:** Protected routes must verify auth in middleware OR at the page/layout level. Double-check before exposing any write operation.
- **Environment variables:** All secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, API keys) live in `.env.local` and Vercel env vars. Never commit them. Reference `.env.example` for the required variable list.
- **Content moderation:** User-generated content (marketplace listings, event descriptions, group messages) must be sanitized against XSS.
- **Rate limiting:** API routes that perform writes (event creation, listing creation) should implement basic rate limiting.
- **DON'T** log sensitive data (tokens, passwords, PII) to console in production code.
- **DON'T** disable TypeScript strict mode or ignore type errors with `@ts-ignore`.

---

## 7. Error Handling & Resilience

- **Graceful degradation:** External API failures (Connpass, Peatix) must not crash the app. Return empty arrays and log errors.
- **Error boundaries:** Implement `error.tsx` at route segment level for runtime error recovery.
- **Loading states:** Every async page must have a `loading.tsx` or Suspense boundary. No blank screens.
- **Form errors:** Display user-friendly localized error messages. Never expose raw DB/API error strings to the user.
- **Fallback data:** Use fallback images (see `FALLBACK_IMAGES` pattern in events service) when external media is unavailable.

---

## 8. Code Quality & Conventions

- **TypeScript:** Strict mode. Define explicit interfaces for all data shapes (see `EventData` pattern).
- **Naming:**
  - Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities/services.
  - Components: PascalCase. Hooks: `use` prefix.
  - Service files: `<feature>.service.ts`.
- **Exports:** Prefer named exports. Default exports only for Next.js page/layout conventions.
- **Comments:** Keep existing comments and docstrings. Add comments for non-obvious logic. Vietnamese comments in DB files are acceptable.
- **DON'T** install new dependencies without justification. Check if the existing stack already solves the problem.
- **DON'T** create utility files outside `src/lib/`. Shared helpers belong there.

---

## 9. Decision-Making Framework

When facing ambiguity, prioritize in this order:

1. **User safety & data integrity** — Never compromise RLS, auth, or input validation.
2. **Mobile-first UX** — Optimize for touch, small screens, and slow networks (target audience accesses on trains).
3. **SEO for public content** — Administrative guides and events must be SSR/SSG with proper metadata.
4. **Performance** — Lazy load images, minimize client JS, use RSC wherever possible.
5. **Developer experience** — Keep code readable, typed, and consistent with existing patterns.

---

## 10. What NOT to Do (Absolute DON'Ts)

- ❌ Create a `pages/` directory or use Pages Router patterns
- ❌ Use `next/link` or `next/navigation` directly (use `@/i18n/routing` wrappers)
- ❌ Hardcode UI strings — everything goes through `next-intl`
- ❌ Call Supabase from components directly — use service layer
- ❌ Use `asChild` prop on shadcn/Base-UI components
- ❌ Skip `sizes` prop on `next/image` when using `fill`
- ❌ Commit `.env.local` or any secrets
- ❌ Use Radix UI primitives — this project uses `@base-ui/react`
- ❌ Use `any` type without explicit justification and a `// TODO: type properly` comment
- ❌ Modify shadcn `ui/` components unless fixing a confirmed bug
