# Local Development & Testing Guide 🧪

This document explains how to test changes to the `prebuilt-components` package locally and how to verify them inside a consuming React project. Use this when you add a feature or fix and want teammates to quickly try it out without publishing to npm.

---

## Prerequisites ✅

- Node.js (LTS recommended)
- npm
- A consuming React project (e.g., CRA, Vite, Next.js) with `react` and `react-dom` installed
- This repository checked out and dependencies installed (`npm install`)

> Note: `react` and `react-dom` are peerDependencies of `prebuilt-components`. Make sure the consuming project has compatible versions.

---

## Quick workflow — npm link (fast, common approach) 🔗

1. In the package repo (root):

   ```bash
   # Install deps
   npm install

   # Build the package (creates dist/ and types)
   npm run build

   # Create a global symlink for this package
   npm link

   # Optional: run rollup in watch mode to rebuild on changes (recommended during active development)
   npm run dev
   ```

2. In your consuming project (where you want to test):

   ```bash
   # Link to the local package
   npm link prebuilt-components

   # Make sure your dev server is running (e.g., npm start or npm run dev)
   npm start
   ```

3. Import and use the library in the consuming project as you normally would:

   ```js
   // App.jsx or index.jsx
   import { NBottomNav, NLoadingComponent } from 'prebuilt-components';
   import 'prebuilt-components/dist/index.css';
   ```

4. Make changes in the package repo. If you ran `npm run dev` (watch), the bundle will be re-built automatically. If not, run `npm run build` and restart the consuming app if needed.

### Troubleshooting (common issues)

- Duplicate React error / "Invalid hook call":
  - This is usually caused by multiple React copies (one inside your linked package and one in the consuming app).
  - Ensure `react` and `react-dom` are only installed in the consuming project. Add bundler alias or resolvers to force resolving `react` to the project's node_modules if necessary.
  - For webpack: add `resolve.alias = { react: path.resolve(__dirname, 'node_modules/react') }` in the consuming app's config.

- Changes not showing up in the consuming app:
  - Make sure your package build is running in watch mode (`npm run dev`) or re-run `npm run build`.
  - Some dev servers do not follow symlinks; restart the consuming dev server if updates are not picked up.

---

## Alternative: npm pack (simulate publish) 📦

This approach creates a tarball that behaves like a published package (good for verifying package contents and build output):

1. In the package root:

   ```bash
   npm install
   npm run build    # ensure `dist/` and types are generated
   npm pack         # creates e.g. prebuilt-components-1.0.0.tgz
   ```

2. In the consuming project:

   ```bash
   # From the consuming project folder
   npm install ../path/to/prebuilt-components/prebuilt-components-1.0.0.tgz
   npm start
   ```

This replicates the published package exactly (files inside `dist/` will be installed).

---

## Alternative: yalc (recommended for a smoother local publish-like workflow) 🔁

`yalc` is a little tool that behaves like a local npm registry, and it avoids many `npm link` pitfalls.

1. Install yalc globally:

   ```bash
   npm i -g yalc
   ```

2. In package repo:

   ```bash
   npm install
   npm run build
   yalc publish
   ```

3. In consuming project:

   ```bash
   yalc add prebuilt-components
   npm start
   ```

4. When you update the package:

   ```bash
   # In package repo
   npm run build
   yalc push
   ```

`yalc` is often easier to use than `npm link` for projects that use strict module resolution.

---

## Recommended developer workflow (fast feedback) ⚡

- Run `npm install` once in both projects.
- In package repo: run `npm run build` to create the initial `dist/` and types (this is required before linking or packing). For fast feedback while actively developing, run `npm run dev` (rollup watch) to continuously rebuild `dist/` on file changes.
- In consuming project: `npm link prebuilt-components` (or `yalc add prebuilt-components`) and run the dev server.
- Edit source in the package repo; confirm rebuilt artifacts; refresh or let HMR pick up changes in the consuming app.

---

## TypeScript & typings check ✅

- Build the package to generate type declarations (`dist/index.d.ts`):

  ```bash
  npm run build
  ```

- In the consuming project, run `tsc --noEmit` (if TypeScript is used) to ensure types are resolved properly.

---

## Clean up / Unlinking 🧹

- To unlink in the consuming project:

  ```bash
  npm unlink prebuilt-components
  npm install prebuilt-components # re-install from registry if you want to restore published package
  ```

- To remove the global link in the package repo:

  ```bash
  npm unlink
  ```

- If you used `yalc`:

  ```bash
  # In consuming project
  yalc remove prebuilt-components
  npm install prebuilt-components
  ```

---

## Developer tips & best practices 💡

- Add simple example(s) and Storybook or a small example app that imports your local build — this makes manual QA much faster.
- Keep `peerDependencies` up-to-date in `package.json` so the consuming project knows which React versions are supported.
- Prefer `npm run dev` while actively developing to get live rebuilds.
- When in doubt, use `npm pack` to confirm what will be published.

---

If you want, I can also add a small example project in the `example/` folder or add a short `dev` script that runs both the package watcher and a sample CRA app concurrently. Would you like me to add that? 🔧
