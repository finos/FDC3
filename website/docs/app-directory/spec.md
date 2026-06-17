---
id: spec
sidebar_label: API
title: App Directory API (next)
---

View the [full specification][1] in [OpenAPI v3.0][2] format (generated with [ReDoc][3]),
or explore with the [Swagger Editor][4].

[1]: pathname:///schemas/next/app-directory.html
[2]: https://www.openapis.org/
[3]: https://github.com/Redocly/redoc/
[4]: https://editor.swagger.io/?url=https://fdc3.finos.org/schemas/next/appd.schema.json

## Endpoints

 Endpoint           | Method | Description
 ------------------ | ------ | -----------
 `/v2/apps`         | GET    | Retrieve all application definitions
 `/v2/apps/{appId}` | GET    | Retrieve an application definition
 `/v1/apps`         | POST   | (deprecated v1 API version) Create a new application definition
 `/v1/apps/{appId}` | GET    | (deprecated v1 API version) Retrieve an application definition
 `/v1/apps/search`  | GET    | (deprecated v1 API version) Retrieve a list of applications

App Directory implementations MAY extend the list of endpoints to provide other necessary functionality. However, FDC3 Desktop Agent implementations that connect to app directories MUST support connection to app directories that only provide the minimum endpoints listed here.

## App Directory Standard Compliance

An FDC3 Standard compliant App Directory implementation **MUST**:

- Implement the specified `/v2` endpoints for retrieving app definitions as defined in the [app directory OpenAPI specification](pathname:///schemas/next/app-directory.html#tag/Application):
  - `/v2/apps` (GET)
  - `/v2/apps/{appId}` (GET)
- Ensure that `appId` field values assigned to applications are unique within the directory.
- Ensure that app directory records served meet the minimum requirements specified in the [app directory OpenAPI specification](pathname:///schemas/next/app-directory.html#tag/Application).
- Support retrieval of app directory records via either the raw `appId` (e.g. `myAppId`) or fully-qualified appId (e.g. `myAppId@host.domain.com`) as defined in the [app directory overview](overview#shrinking-the-uri).

An FDC3 Standard compliant App Directory implementation **SHOULD**:

- Support authentication (where required) via the HTTP Authorization header and Bearer authentication scheme (implemented via JWT tokens)
- Select any `categories` field values from the recommended list.
- Encourage the use of the `lang` and `localizedVersions` fields in appD records to support localization and accessibility.

An FDC3 Standard compliant App Directory implementation **MAY**:

- Support filtering of application records returned by user entitlement, where authentication is enabled.
- Implement the deprecated `/v1` endpoints provided for backwards compatibility with prior version of the standard:
  - `/v1/apps` (POST)
  - `/v1/apps/{appId}` (GET)
  - `/v1/apps/search` (GET)
- Extend the implementation with additional endpoints.

## Application compatibility

App Directory records MAY include an optional `minimumAgentVersion` field on each application. This declares the minimum FDC3 API version that the application requires the Desktop Agent to implement. It uses the same version string format as `ImplementationMetadata.fdc3Version` (for example `"1.2"`, `"2.0"`, `"2.2"`).

This field is **distinct from** the existing `version` field, which describes the application's own software release (for example `"1.0.0"`).

When `minimumAgentVersion` is **`2.2` or higher**, the application is assumed to require the Web Connection Protocol and **`getAgent()`** (see [Supported Platforms](../api/supported-platforms.md)).

When `minimumAgentVersion` is **absent**, Desktop Agents MUST NOT exclude the application solely on compatibility grounds — the record is treated as legacy or unknown.

Desktop Agents **SHOULD** exclude applications from open and intent resolution candidate lists when:

- `minimumAgentVersion` is present and the Desktop Agent's `fdc3Version` (from `getInfo()`) is lower than the required version, or
- `minimumAgentVersion` is `2.2` or higher and the Desktop Agent does not support the Web Connection Protocol / `getAgent()`.

App Directory publishers **SHOULD** populate `minimumAgentVersion` for web applications. Examples in this repository use:

| Application | `minimumAgentVersion` |
|-------------|----------------------|
| FDC3 Workbench | `"1.2"` |
| Other example, demo, and conformance apps | `"2.0"` |

See [issue #1871](https://github.com/finos/FDC3/issues/1871) for background.
