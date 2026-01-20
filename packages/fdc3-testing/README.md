# @finos/fdc3-testing

A shared testing infrastructure for FDC3 Cucumber-based test suites. This module provides a **domain-specific language (DSL)** for testing FDC3 APIs in a readable, declarative way.

## Purpose

The testing module provides:

- **Reusable step definitions** for common testing patterns
- **A `PropsWorld` class** that holds test state in a key-value store
- **Variable resolution** using `{variable}` syntax to reference stored values
- **JSONPath matching** for validating complex objects
- **Schema validation** to verify messages conform to FDC3 schemas

## Installation

```json
{
  "devDependencies": {
    "@finos/fdc3-testing": "2.2.1-beta.4"
  }
}
```

## The Testing DSL

The DSL allows tests to be written in natural language while still being precise.

### Variable References

Variables are referenced using curly braces: `{variableName}`. Special values include:

| Syntax | Meaning |
|--------|---------|
| `{null}` | Represents null |
| `{true}` / `{false}` | Boolean values |
| `{123}` | Numeric values (any number) |
| `{result}` | The result of the last operation |
| `{api}` | Typically the Desktop Agent instance |
| `{myVar}` | Any variable stored in the test world |

### Core Step Definitions

#### Calling Methods

```gherkin
When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}"
When I call "{api}" with "open" with parameters "appId" and "{context}" and "{options}"
```

#### Storing References

```gherkin
When I refer to "{result}" as "channel1"
```

#### Promise Resolution

```gherkin
Then the promise "{myPromise}" should resolve
Then the promise "{myPromise}" should resolve within 10 seconds
```

#### Assertions

```gherkin
Then "{result}" is null
Then "{result}" is not null
Then "{result}" is true
Then "{result}" is false
Then "{result}" is undefined
Then "{result}" is empty
Then "{result}" is "expected value"
Then "{result}" is an error
Then "{result}" is an error with message "UserCancelledResolution"
```

#### Object Matching

```gherkin
Then "{result}" is an object with the following contents
  | source.appId | source.instanceId |
  | bank         | b1                |
```

#### Array Validation

```gherkin
Then "{result}" is an array of objects with the following contents
  | type | id.channelId |
  | user | one          |
  | user | two          |

Then "{result}" is an array of objects with length "{expectedLength}"

Then "{result}" is an array of strings with the following values
  | value   |
  | string1 |
  | string2 |
```

#### Schema Validation

The `matches_type` column validates that data conforms to an FDC3 schema:

```gherkin
Then messaging will have posts
  | payload.intent | payload.context.type | matches_type       |
  | OrderFood      | fdc3.instrument      | raiseIntentRequest |
```

#### Utilities

```gherkin
Given schemas loaded
Given we wait for a period of "500" ms
Given "{handler}" is a invocation counter into "{count}"
Given "{fn}" is a function which returns a promise of "{value}"
```

### JSONPath Support

Table columns use JSONPath expressions to match nested object properties:

| Expression | Matches |
|------------|---------|
| `source.appId` | `result.source.appId` |
| `payload.context.id.ticker` | Deeply nested values |
| `payload.app.instanceId` | Can match `{null}` for undefined |

## Usage

### Basic Setup

Import and call `setupGenericSteps()` in your step definitions:

```typescript
import { setupGenericSteps } from '@finos/fdc3-testing';

setupGenericSteps();
```

### Extending PropsWorld

Extend `PropsWorld` if you need additional test state:

```typescript
import { PropsWorld } from '@finos/fdc3-testing';

export class MyWorld extends PropsWorld {
  myCustomState: SomeType;
}
```

### Example Feature File

```gherkin
Feature: Basic Intents Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded
    And app "chipShop/c1" resolves intent "OrderFood" with result type "void"
    And app "bank/b1" resolves intent "Buy" with context "fdc3.instrument" and result type "fdc3.order"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: Raising an intent and invoking the intent resolver
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | chipShop     | c1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | {null}                 | raiseIntentRequest |
      | OrderFood      | fdc3.instrument      | c1                     | raiseIntentRequest |

  Scenario: Raising an intent but the user cancels
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{cancelContext}"
    Then "{result}" is an error with message "UserCancelledResolution"
```

## Module Structure

```
packages/fdc3-testing/
├── src/
│   ├── index.ts           # Main exports
│   ├── steps/
│   │   └── generic.steps.ts   # Generic step definitions
│   ├── support/
│   │   └── matching.ts        # JSONPath matching & validation
│   └── world/
│       └── index.ts           # PropsWorld class
└── dist/
    └── features/              # Shared feature files
        ├── agent-proxy/       # Tests for fdc3-agent-proxy
        ├── get-agent/         # Tests for fdc3-get-agent
        ├── security/          # Security-related tests
        └── web-impl/          # Web implementation tests
```

## Exports

```typescript
import { 
  setupGenericSteps,  // Call to register generic step definitions
  PropsWorld,         // Base world class for test state
  handleResolve,      // Resolve {variable} references
  matchData,          // Match arrays against DataTables
  doesRowMatch,       // Match single row against object
  indexOf             // Find matching row index
} from '@finos/fdc3-testing';
```

## Feature File Reuse

The `fdc3-testing` module also exports Cucumber feature files for reuse by client library implementations in other languages (e.g., [fdc3-java-api](https://github.com/finos/fdc3-java-api)).

This allows implementations to run the same behavioral tests, ensuring conformance with the FDC3 specification regardless of the implementation language.
