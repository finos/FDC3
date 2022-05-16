---
id: spec
sidebar_label: App Directory Specification
title: App Directory Specification (next)
---
## API

View the [full specification](/schemas/next/app-directory) in [OpenAPI v3.0](https://www.openapis.org/) format (generated with [ReDoc](https://github.com/Redocly/redoc/)).

## Endpoints

 Endpoint           | Method | Description
 ------------------ | ------ | -----------
 `/v2/apps`         | GET    | Retrieve all application definitions
 `/v2/apps/{appId}` | GET    | Retrieve an application defintion
 `/v1/apps`         | POST   | (deprecated v1 API version) Create a new application definition
 `/v1/apps/{appId}` | GET    | (deprecated v1 API version) Retrieve an application defintion
 `/v1/apps/search`  | GET    | (deprecated v1 API version) Retrieve a list of applications

App Directory implementations MAY extend the list of endpoints to provide other necessary functionality. However, FDC3 Desktop Agent implementations MUST support connection to app directories that only provide the minimum endpoints listed here.
