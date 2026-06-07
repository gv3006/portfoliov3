# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project. Route files live in `app/`, with `app/page.tsx` composing the main portfolio page and `app/layout.tsx` defining the shared shell. Reusable React components live in `components/`; section components are in `components/sections/`, and shadcn/Radix primitives are in `components/ui/`. Custom hooks belong in `hooks/`, utilities in `lib/`, global CSS in `app/globals.css` and `styles/globals.css`, and static images/icons in `public/`.

Use the `@/*` alias for internal imports, for example `@/components/site-header`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build and run Next.js checks.
- `npm run start`: serve the built production app locally.
- `npm run lint`: run ESLint across the repository.

The repository contains both `package-lock.json` and `pnpm-lock.yaml`; prefer `npm` unless the project is intentionally switched to one package manager.

## Coding Style & Naming Conventions

Write TypeScript and TSX with strict types enabled. Use function components and named exports for shared components, such as `SiteHeader` or `WorksGallery`. Name component files in kebab case (`site-header.tsx`) and hooks with `use-` prefixes (`use-mobile.ts`). Keep helpers in `lib/` and compose conditional Tailwind classes with `cn()`.

Follow the existing compact React style: two-space indentation, inline Tailwind utilities, and `"use client"` only when browser APIs, state, or effects are required.

## Testing Guidelines

No test framework is currently configured. Before opening a PR, run `npm run lint` and `npm run build`. For UI changes, manually verify the page in `npm run dev` at desktop and mobile widths. If tests are added later, name them after the unit under test, for example `site-header.test.tsx`.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no repository-specific commit convention can be inferred. Use clear, imperative commit messages such as `Add portfolio section animation` or `Fix mobile header spacing`.

Pull requests should include a short summary, screenshots or recordings for visual changes, manual verification steps, and linked issues when applicable. Keep PRs focused; avoid mixing copy, styling, dependency, and architecture changes unless they support the same fix.

## Agent-Specific Instructions

Do not edit generated directories such as `.next/` or `node_modules/`. Keep changes scoped to source files and public assets, preserve existing shadcn component patterns, and update this guide when build scripts, structure, or testing practices change.
