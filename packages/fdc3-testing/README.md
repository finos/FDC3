# @finos/fdc3-testing

This package provides testing utilities and feature files for FDC3 implementations.

## Installation

```bash
npm install @finos/fdc3-testing
```

## Usage

### Importing Testing Utilities

```typescript
import {
  PropsWorld,
  doesRowMatch,
  handleResolve,
  indexOf,
  matchData,
  setupGenericSteps,
  SimpleIntentResolver,
  addFormats,
  Ajv2019,
  CHANNEL_STATE,
} from '@finos/fdc3-testing';
```

### Accessing Feature Files

The package also includes feature files from various FDC3 modules so that you can use these to test functionality outside the main FDC3 repo.

- `features/security/` - Security-related feature files
- `features/get-agent/` - Get Agent feature files  
- `features/agent-proxy/` - Agent Proxy feature files
- `features/web-impl/` - Web Implementation feature files

