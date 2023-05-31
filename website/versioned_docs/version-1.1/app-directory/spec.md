---
sidebar_label: App Directory Specification
title: App Directory Specification 1.1
original_id: spec
---
## API

View the [full specification][1] in [OpenAPI v3.0][2] format (generated with [ReDoc][3]),
or explore with the [Swagger Editor][4].

[1]: pathname:///schemas/1.1/app-directory.html
[2]: https://www.openapis.org/
[3]: https://github.com/Redocly/redoc/
[4]: https://editor.swagger.io/?url=https://fdc3.finos.org/schemas/1.1/app-directory.yaml

## Endpoints

 Endpoint           | Method | Description
 ------------------ | ------ | -----------
 `/v1/apps`         | POST   | Create a new application definition
 `/v1/apps/{appId}` | GET    | Retrieve an application defintion
 `/v1/apps/search`  | GET    | Retrieve a list of applications
