# FDC3 Repository Rules for Amazon Q

Read and follow the guidance in [AGENTS.md](../../AGENTS.md) at the root of this repository. It describes the monorepo structure, module dependencies, build/test conventions, and common change patterns.

## Key Reminders

- This is an npm workspaces monorepo. Build order matters: `fdc3-schema` → `fdc3-standard` → `fdc3-agent-proxy` / `fdc3-web-impl` → `fdc3-get-agent`.
- Never edit generated files in `packages/fdc3-schema/generated/` or `packages/fdc3-context/generated/`. Edit the `.schema.json` source files and rebuild.
- JSON schemas (`packages/fdc3-schema/schemas/api/`) and TypeScript interfaces (`packages/fdc3-standard/src/api/`) must be kept in sync manually.
- Tests use Cucumber/Gherkin (`.feature` files) with `quickpickle` + `vitest`. The `packages/testing` module provides shared step definitions.
- The test `ServerContext` uses sequential UUIDs (`uuid0`, `uuid1`, ...). Adding `createUUID()` calls shifts subsequent values in existing tests.
- All TypeScript imports must use `.js` extensions (ESM with NodeNext resolution).
- All workspace packages share the same version number. Use `npm run syncpack` after version changes.
- Update `CHANGELOG.md` under `[Unreleased]` for non-trivial changes.
- Contributions must maintain or improve test coverage in `fdc3-agent-proxy`, `fdc3-get-agent`, `fdc3-standard`, and `fdc3-web-impl`.
- Do not edit `website/versioned_docs/`, `website/versioned_sidebars/`, or `website/static/schemas/` — these are snapshots from past FDC3 releases, unless a correction is specifically requested.
- Conformance tests validate Desktop Agent compliance. Test definitions (with unique IDs like `UCBasicUsage1`) live in `website/docs/api/conformance/`; implementations live in `toolbox/fdc3-conformance/`. Features using MUST/MUST NOT keywords require conformance tests. See AGENTS.md for full details.
