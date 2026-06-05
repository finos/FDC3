# FDC3 example apps

This toolbox package holds **sample web applications** used to exercise FDC3 (channels, intents, app metadata, security helpers, and related flows) against a Desktop Agent (see `toolbox/fdc3-for-web/demo module`).

## Layout

| Path | Role |
|------|------|
| `front-end-apps/` | Browser-only or primarily client-side examples. Each subfolder is one app. |
| `server-apps/` | Examples that pair a Vite-served SPA with optional **Express** routes or **WebSockets** in the same process (see below). |
| `common/` | Shared TypeScript used by more than one app (for example security-demo helpers). The dev server allows Vite to resolve imports into this tree when needed. |
| `directory/` | App Directory payloads: hand-maintained JSON fragments (for example workbench or conformance presets) and a **`generated/`** subtree produced at dev startup. |

Apps are **not** registered in a central manifest: anything under `front-end-apps/` or `server-apps/` that looks like an app is picked up automatically.

## Per-app conventions

Each app lives in its own directory and is expected to have at least:

- **`index.html`** — entry document; required for discovery.
- **`static/`** — assets served as static files; often includes **`appd.v2.json`** (one or more `applications` records) used when merging the generated directory.
- **`src/`** — application source (TypeScript or TSX). For server-style apps, an optional **`backend.ts`** default-export can attach Express middleware and share the HTTP server (for example APIs plus WebSockets on the app port).
- **`properties.json`** (optional) — may set a fixed **`port`**; otherwise ports are assigned sequentially from a base port when you run the dev orchestrator.

## Running locally (monorepo)

From this directory:

```bash
npm run dev
# or
npm start
```

## Running from npm (after publish)

Once `@finos/fdc3-example-apps` is published:

```bash
npx @finos/fdc3-example-apps
# or, after npm install @finos/fdc3-example-apps
npx fdc3-example-apps
```

Point your Desktop Agent at the combined App Directory URL printed on startup (by default `http://localhost:4005/static/generated/fdc3-example-apps.json`).

## Dev orchestrator (`main.ts`)

`npm run dev` (or the `fdc3-example-apps` bin) runs `main.ts`, which:

1. **Discovers** every subdirectory of `front-end-apps/` and `server-apps/` that contains `index.html`.
2. **Assigns** each app an HTTP port (with optional overrides from `properties.json`).
3. **Merges** all `static/appd.v2.json` files into `directory/generated/fdc3-example-apps.json` so a Desktop Agent can load a single combined App Directory for local demos.
4. **Starts** one Express + Vite dev server per app (isolated Vite `root` and cache), serving the SPA and static assets, and loading `src/backend.ts` when present.

Point your agent or workbench at the generated directory file and the per-app `http://localhost:<port>` URLs as appropriate for your scenario.
