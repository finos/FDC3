# AI Agent Guidance for the FDC3 Repository

This document provides guidance for AI coding agents working on the FDC3 monorepo. It describes the repository structure, key relationships between modules, build and test conventions, and common pitfalls.

For agent-specific configuration, see:

- **Amazon Q**: [`.amazonq/rules/fdc3.md`](.amazonq/rules/fdc3.md)
- **Kiro**: [`.kiro/steering.md`](.kiro/steering.md)
- **GitLab Duo**: [`.gitlab/agents.md`](.gitlab/agents.md)

## Repository Overview

FDC3 is an open standard for financial desktop interoperability. This repository is an **npm workspaces monorepo** containing the standard's TypeScript type definitions, JSON schemas, reference implementations, test suites, documentation website, and developer tooling.

The root `package.json` defines the workspace list and the build order is implicit in the dependency graph (see below).

## Module Map and Dependency Graph

```
Build order (left to right):

fdc3-context ──┐
               ├─► fdc3-standard ──┬─► fdc3-agent-proxy ──┬─► fdc3-get-agent ──► fdc3 ──► fdc3-commonjs
fdc3-schema ───┘                   │                       │
                                   └─► fdc3-web-impl ──────┘
                                                           └─► demo, fdc3-workbench, fdc3-conformance
```

| Module | Path | npm Package | Role |
|--------|------|-------------|------|
| `fdc3-context` | `packages/fdc3-context` | `@finos/fdc3-context` | JSON schemas for FDC3 context types → generates `ContextTypes.ts` |
| `fdc3-schema` | `packages/fdc3-schema` | `@finos/fdc3-schema` | DACP and bridging protocol JSON schemas → generates `BrowserTypes.ts` and `BridgingTypes.ts` |
| `fdc3-standard` | `packages/fdc3-standard` | `@finos/fdc3-standard` | TypeScript interfaces for the FDC3 API (e.g. `DesktopAgent`, `Channel`, `ContextMetadata`) |
| `fdc3-agent-proxy` | `packages/fdc3-agent-proxy` | `@finos/fdc3-agent-proxy` | Client-side proxy implementing the FDC3 DACP (Desktop Agent Communication Protocol) |
| `fdc3-get-agent` | `packages/fdc3-get-agent` | `@finos/fdc3-get-agent` | `getAgent()` and `fdc3Ready()` — web connection protocol implementation |
| `fdc3-web-impl` | `toolbox/fdc3-for-web/fdc3-web-impl` | `@finos/fdc3-web-impl` | Server-side (Desktop Agent side) DACP implementation |
| `fdc3` | `packages/fdc3` | `@finos/fdc3` | Roll-up package: the main entry point for apps using FDC3 |
| `fdc3-commonjs` | `packages/fdc3-commonjs` | `@finos/fdc3-commonjs` | CommonJS backwards-compatibility roll-up |
| `demo` | `toolbox/fdc3-for-web/demo` | — | Reference Desktop Agent implementation |
| `fdc3-workbench` | `toolbox/fdc3-workbench` | — | Interactive FDC3 testing tool |
| `fdc3-conformance` | `toolbox/fdc3-conformance` | — | Conformance test suite definitions |

## Critical Relationships

### 1. Schema → Generated Types → Standard Interfaces

This is the most important relationship to understand. Changes flow in one direction:

```
JSON Schema files                    Generated TypeScript              Hand-written interfaces
─────────────────                    ────────────────────              ───────────────────────
packages/fdc3-schema/                packages/fdc3-schema/             packages/fdc3-standard/
  schemas/api/*.schema.json    ──►     generated/api/BrowserTypes.ts     src/api/*.ts
  schemas/bridging/*.json      ──►     generated/bridging/BridgingTypes.ts
packages/fdc3-context/
  schemas/context/*.json       ──►   packages/fdc3-context/
                                       generated/ContextTypes.ts
```

**Key rules:**
- `BrowserTypes.ts` and `BridgingTypes.ts` are **generated** — never edit them directly.
- The JSON schemas in `fdc3-schema` define the wire protocol (DACP) message shapes.
- The TypeScript interfaces in `fdc3-standard` define the **public API** that apps code against.
- These two must be kept in sync **manually**. When you add a field to a schema, the corresponding `fdc3-standard` interface must be updated, and vice versa.
- Schema generation uses `quicktype` via `s2tQuicktypeUtil.cjs`. Run `npm run build` in `fdc3-schema` to regenerate.
- The central schema file `packages/fdc3-schema/schemas/api/api.schema.json` contains shared type definitions (e.g. `ContextMetadata`, `AppIdentifier`) referenced by individual message schemas.

### 2. Standard Interfaces → Proxy (Client) and Web-Impl (Server)

```
fdc3-standard (interfaces)
    │
    ├──► fdc3-agent-proxy (client-side implementation)
    │      Implements Channel, DesktopAgent etc.
    │      Sends DACP request messages, receives response/event messages
    │
    └──► fdc3-web-impl (server-side implementation)
           Receives DACP request messages, sends response/event messages
           Handlers: BroadcastHandler, IntentHandler, OpenHandler
```

When adding a new API method or modifying message payloads, you typically need to touch:
1. The JSON schema (wire format)
2. The `fdc3-standard` interface (public API)
3. The `fdc3-agent-proxy` implementation (client sends/receives)
4. The `fdc3-web-impl` handler (server receives/sends)
5. Tests in both proxy and web-impl
6. Documentation in `website/docs/api/`

### 3. API Documentation ↔ Standard Interfaces

The website documentation in `website/docs/api/ref/` mirrors the `fdc3-standard` interfaces:

| Interface file | Documentation file |
|---|---|
| `src/api/DesktopAgent.ts` | `website/docs/api/ref/DesktopAgent.md` |
| `src/api/Channel.ts` | `website/docs/api/ref/Channel.md` |
| `src/api/Types.ts` | `website/docs/api/ref/Types.md` |
| `src/api/ContextMetadata.ts` | `website/docs/api/ref/Metadata.md` |
| `src/api/Errors.ts` | `website/docs/api/ref/Errors.md` |
| `src/api/Events.ts` | `website/docs/api/ref/Events.md` |
| `src/api/PrivateChannel.ts` | `website/docs/api/ref/PrivateChannel.md` |

The DACP wire protocol is documented in `website/docs/api/specs/desktopAgentCommunicationProtocol.md`.

## Build and Test

### Building

```bash
npm install          # from repo root
npm run build        # builds all workspaces in dependency order
```

To build a single module, `cd` into it and run `npm run build`. But remember: if you changed a dependency (e.g. `fdc3-schema`), you must rebuild it first.

### Testing

```bash
npm run test         # runs all workspace tests
```

Or test individual modules:

```bash
cd packages/fdc3-agent-proxy && npm test
cd toolbox/fdc3-for-web/fdc3-web-impl && npm test
```

**Test framework:** Both `fdc3-agent-proxy` and `fdc3-web-impl` use **Cucumber/Gherkin** via `quickpickle` + `vitest`. Test files are `.feature` files in `test/features/`, with step definitions in `test/step-definitions/`.

**Cucumber test steps:** Generic steps come from [`@robmoffat/standard-cucumber-steps`](https://github.com/robmoffat/standard-cucumber-steps) (via `setupFdc3TestSteps()` in `@finos/fdc3-schema/cucumber`). FDC3-specific `matches_type` validation and schema loading are in `@finos/fdc3-schema/cucumber`. FDC3-only test doubles (intent resolver, channel selector, etc.) live in each consumer's `test/support/`.

**Coverage policy:** Contributions to `fdc3-agent-proxy`, `fdc3-get-agent`, `fdc3-standard`, and `fdc3-web-impl` must maintain or improve test coverage. Coverage is reported in PR comments.

### Test Gotchas

- **UUID counter in tests:** The test `ServerContext` uses a sequential UUID generator (`uuid0`, `uuid1`, ...). Adding new `sc.createUUID()` calls in handler code shifts all subsequent UUID values in existing tests. If tests fail after your change with UUID mismatches, update the expected values.
- **Feature file structure:** Each `.feature` file has a `Background` section that sets up the test world. Steps reference objects by name using `{curly-brace}` syntax (e.g. `{api}`, `{result}`, `{channel1}`).
- **`matchData` function:** Used in step definitions to assert on nested object properties using dot-notation paths (e.g. `payload.context.type`).

## Code Style and Conventions

- **Formatting:** Prettier with config in root `package.json` — 120 char line width, single quotes, trailing commas (es5), 2-space indent.
- **TypeScript:** Strict mode. `NodeNext` module resolution. Target `ESNext`. All modules use `"type": "module"` (ESM).
- **Imports:** Use `.js` extensions in import paths (required for ESM with NodeNext resolution), e.g. `import { Foo } from './Foo.js'`.
- **License headers:** All source files must include the Apache 2.0 SPDX header.
- **Linting:** ESLint with Prettier integration. Run `npm run lint` in individual packages.
- **Pre-commit:** Husky runs `prettier --write` via `lint-staged` on all staged files.

## Common Change Patterns

### Adding a new field to an existing DACP message

1. Update the relevant `.schema.json` file(s) in `packages/fdc3-schema/schemas/api/`
2. If the field uses a shared type, update `api.schema.json`
3. Rebuild `fdc3-schema` (`cd packages/fdc3-schema && npm run build`) to regenerate `BrowserTypes.ts`
4. Update the corresponding `fdc3-standard` TypeScript interface if the field is part of the public API
5. Update `fdc3-agent-proxy` to send/receive the new field
6. Update `fdc3-web-impl` handler to process the new field
7. Add tests in both `fdc3-agent-proxy` and `fdc3-web-impl`
8. Update documentation in `website/docs/api/`
9. Add a CHANGELOG entry under `[Unreleased]`

### Adding a new API method

1. Add the method signature to the relevant interface in `fdc3-standard` (e.g. `Channel.ts`, `DesktopAgent.ts`)
2. If it requires new DACP messages, create request/response schema files and reference them from `api.schema.json`
3. Implement in `fdc3-agent-proxy` (client side)
4. Implement in `fdc3-web-impl` (server side handler)
5. Add Cucumber scenarios in both test suites
6. Document in `website/docs/api/ref/` and update `website/docs/api/specs/desktopAgentCommunicationProtocol.md`
7. Export from `fdc3-standard/src/index.ts` if it's a new type
8. Add CHANGELOG entry

### Modifying context types

Context type schemas live in `packages/fdc3-context/schemas/context/`. Changes regenerate `ContextTypes.ts`. These are independent of the DACP protocol schemas.

## Conformance Testing

FDC3 includes a conformance testing system that validates whether a Desktop Agent implementation conforms to the standard. This system has two parts: **test definitions** (in the standard's documentation) and **test implementations** (in the conformance package).

### Compliance Requirements and RFC 2119 Keywords

The FDC3 standard follows [RFC 2119](https://tools.ietf.org/html/rfc2119) for requirement levels. The compliance requirements for each part of the standard are defined in:

- **Desktop Agent API**: `website/docs/api/spec.md` — section "Desktop Agent API Standard Compliance"
- **App Directory**: `website/docs/app-directory/spec.md` — section "App Directory Standard Compliance"
- **Intents**: `website/docs/intents/spec.md` — section "Intents Standard Compliance"
- **Context Data**: `website/docs/context/spec.md` — section "Context Data Standard Compliance"

The overall compliance policy is described in `website/docs/fdc3-compliance.md`.

**When conformance tests are required:**
- Features described with **MUST** or **MUST NOT** keywords require conformance tests.
- Features described with **SHOULD**, **MAY**, or **OPTIONAL** do not always require tests. However, if an optional feature is implemented, it MUST conform to the standard — in which case a **conditional** conformance test should be provided (one that only runs if the feature is present).
- Features marked `@experimental` are generally optional for compliance but recommended for implementation.

### Test Definitions

Conformance test definitions live in `website/docs/api/conformance/` and form part of the published FDC3 standard:

| File | Coverage |
|------|----------|
| `Overview.md` | Index and general notes |
| `Basic-Tests.md` | Connection, basic API sanity checks |
| `Open-Tests.md` | `fdc3.open()` behavior |
| `User-Channel-Tests.md` | User channel broadcast, filtering, join/leave |
| `App-Channel-Tests.md` | App channel behavior |
| `Metadata-Tests.md` | `getInfo()`, `getAppMetadata()`, `findInstances()` |
| `Intents-Tests.md` | `findIntent`, `raiseIntent`, intent results, private channels |

Each test definition has a **unique identifier** (e.g. `UCBasicUsage1`, `2.0-RaiseIntentSingleResolve`, `BasicCL1`). These IDs are the link between the definitions and their implementations.

Test definitions describe multi-app scenarios in table format, specifying which app performs each step. Some tests are **manual** (e.g. intent resolver UI, channel selector UI) because they require user interaction.

### Test Implementations

Conformance tests are implemented in `toolbox/fdc3-conformance/`. This is a browser-based test suite using **Mocha** and **Chai**, bundled with **Webpack**. It runs inside a Desktop Agent (e.g. the `demo` reference implementation) and tests the agent's behavior from the perspective of web applications.

The implementation has three key parts:

```
toolbox/fdc3-conformance/
├── src/
│   ├── test/                    # Test runner and test implementations
│   │   ├── basic/               # Basic sanity tests (e.g. fdc3.basic.ts)
│   │   ├── advanced/            # Full test suites (channels, intents, open, etc.)
│   │   ├── manual/              # Manual/interactive tests (resolver UI, etc.)
│   │   ├── support/             # Shared test utilities and helpers
│   │   ├── testSuite.ts         # Test registry — maps test names to implementations
│   │   └── index.ts             # Browser entry point
│   ├── mock/                    # Mock applications used as counterparts in tests
│   │   ├── basic.ts             # Simple app that listens for context/intents
│   │   ├── channel.ts           # App for channel tests
│   │   ├── intent-a.ts .. k.ts  # Apps A-K for intent tests (each with specific behavior)
│   │   ├── open-a.ts            # App for open tests
│   │   └── metadata.ts          # App for metadata tests
│   └── context-types.ts         # Custom context types used in tests
├── static/
│   ├── apps/                    # HTML entry points for each mock app
│   └── directories/             # AppD records for test apps
└── package.json
```

**Architecture:** Tests are multi-app. A "Test" app (the runner) orchestrates the scenario, while "mock" apps (A, B, C, etc.) are launched by the Desktop Agent and perform their roles (listening for intents, broadcasting context, etc.). Communication between the test runner and mock apps happens via FDC3 context broadcasts on a control channel.

**Naming convention:** Each test implementation's `it()` block title must include the test definition ID in parentheses, e.g.:
```typescript
it('(UCBasicUsage1) Should receive context when adding a listener...', async () => { ... });
```
This allows tracing from a test result back to the corresponding definition in the standard.

### Adding or Updating Conformance Tests

When adding a new standard feature that includes MUST/MUST NOT requirements:

1. **Write the test definition** in the appropriate file under `website/docs/api/conformance/`. Follow the existing table format describing the multi-app steps. Assign a unique test ID.
2. **Implement the test** in `toolbox/fdc3-conformance/src/test/`. Add it to the appropriate file in `basic/` or `advanced/`, or create a new file if needed.
3. **Register the test** in `testSuite.ts` so it appears in the test runner UI.
4. **Create or update mock apps** if the test requires new app behaviors. Each mock app needs:
   - A TypeScript source file in `src/mock/`
   - An HTML entry point in `static/apps/<app-name>/`
   - An AppD record in `static/directories/website-conformance.json`
5. **Use the test definition ID** as the prefix in the `it()` block title.

For optional/conditional features (SHOULD/MAY), implement the test but make it conditional on the feature being available (e.g. check `ImplementationMetadata.optionalFeatures`).

## Version Management

All workspace packages share the same version number (currently `2.2.2`). Use `syncpack` to keep versions consistent:

```bash
npm version <new-version> --workspaces
npm run syncpack
```

## Files You Should Always Update

When making non-trivial changes:

- **`CHANGELOG.md`** — Add entries under `[Unreleased]` in the appropriate section (`Added`, `Changed`, `Deprecated`, `Fixed`).
- **`website/docs/`** — Keep documentation in sync with API and schema changes.
- **Tests** — Maintain or improve coverage. Both Cucumber feature files and step definitions may need updates.

## What NOT to Edit

- `packages/fdc3-schema/generated/` — These files are generated. Edit the `.schema.json` sources instead.
- `packages/fdc3-context/generated/` — Same: edit the context schemas.
- `website/versioned_docs/` and `website/versioned_sidebars/` — These are snapshots of documentation from previous FDC3 releases. Only edit `website/docs/` for current work. Do not edit these unless a correction is specifically requested.
- `website/static/schemas/` — Snapshots of JSON schemas from previous FDC3 releases. Do not edit unless a correction is specifically requested.
- `packages/fdc3/` and `packages/fdc3-commonjs/` — These are roll-up packages with only `import`/`export` statements. Don't add logic here.
