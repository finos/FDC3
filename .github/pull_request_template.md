## Describe your change

<!--- Describe your change here-->

### Related Issue
<!--- This project prefers to accept pull requests related to open issues -->
<!--- If suggesting a new feature or change, please discuss it in an issue first -->
<!--- Please [link to the issue here](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) by writing "resolves #123456" here: -->

## Contributor License Agreement

<!--- All contributions to FDC3 must be made under an active contributor license agreement and the [Community Specification License](https://github.com/finos/FDC3/blob/main/LICENSE.md). This will be checked by the EasyCLA tool (https://easycla.lfx.linuxfoundation.org/) that runs automatically on every PR. If you've not contributed to FDC3 before, look for a comment on your PR shortly after it is raised and follow the instructions to establish a CLA or have it acknowledged by the EasyCLA tool. -->

- [ ] I acknowledge that a contributor license agreement is required and that I have one in place or will seek to put one in place ASAP.

## Review Checklist

<!--- Checklist to be completed by reviewers, and pre-checked by the authors of a PR -->

- [ ] **Issue**: If a change was made to the FDC3 Standard, was an issue linked above?
- [ ] **CHANGELOG**: Is a *CHANGELOG.md* entry included?
- [ ] **API changes**: Does this PR include changes to any of the FDC3 APIs (`DesktopAgent`, `Channel`, `PrivateChannel`, `Listener`, `Bridging`)?
  - [ ] **Docs & Sources**: If yes, were both documentation (/docs) and sources updated?<br/>
        *JSDoc comments on interfaces and types should be matched to the main documentation in /docs*
  - [ ] **Conformance tests**: If yes, are conformance test definitions (/toolbox/fdc3-conformance) still correct and complete?<br/>
        *Conformance test definitions should cover all **required** aspects of an FDC3 Desktop Agent implementation, which are usually marked with a **MUST** keyword, and  optional features (**SHOULD** or **MAY**) where the format of those features is defined*
  - [ ] **Schemas**: If yes, were changes applied to the Bridging and FDC3 for Web protocol schemas?<br/>
        *The Web Connection protocol and Desktop Agent Communication Protocol schemas must be able to support all necessary aspects of the Desktop Agent API, while Bridging must support those aspects necessary for Desktop Agents to communicate with each other*
    - [ ] If yes, was code generation (`npm run build`) run and the results checked in?<br/>
        *Generated code will be found at `/src/api/BrowserTypes.ts` and/or `/src/bridging/BridgingTypes.ts`*
- [ ] **Context types**: Were new Context type schemas created or modified in this PR?
  - [ ] Were the [field type conventions](https://fdc3.finos.org/docs/context/spec#field-type-conventions) adhered to?
  - [ ] Was the `BaseContext` schema applied via `allOf` (as it is in existing types)?
  - [ ] Was a `title` and `description` provided for all properties defined in the schema?
  - [ ] Was at least one example provided?
  - [ ] Was code generation (`npm run build`) run and the results checked in?<br/>
        *Generated code will be found at `/src/context/ContextTypes.ts`*
- [ ] **Intents**: Were new Intents created in this PR?
  - [ ] Were the [intent name prefixes](https://fdc3.finos.org/docs/intents/spec#intent-name-prefixes) and other [naming conventions & characteristics](https://fdc3.finos.org/docs/intents/spec#naming-conventions) adhered to?
  - [ ] Was the new intent added to the list in the [Intents Overview](https://fdc3.finos.org/docs/intents/spec#standard-intents)?
