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

- [ ] If a change was made to the FDC3 Standard, was an issue linked above?
- [ ] Is a CHANGELOG.md entry included?
- [ ] Does this PR include changes to any of the FDC3 API (`DesktopAgent`, `Channel`, `PrivateChannel`, `Listener`, `Bridging`)?
  - [ ] If yes, were both documentation (/docs) and sources updated?<br/>
        *jsDoc comments are on interfaces and types should be matched to the main documentation in /docs*
  - [ ] If yes, are conformance test definitions (/toolbox/fdc3-conformance) still correct and complete?<br/>
        *Conformance test definitions should cover all **required** aspects of an FDC3 Desktop Agent implementation, which are usually marked with a **MUST** keyword, and  optional features (**SHOULD** or **MAY**) where the format of those features is defined*
  - [ ] If yes, were changes applied to the Bridging and FDC3 for Web protocol schemas?<br/>
        *The Web Connection protocol and Desktop Agent Communication Protocol schemas must be able to support all necessary aspects of the Desktop Agent API, while Bridging must support those aspects necessary for Desktop Agents to communicate with each other*
- [ ] Were schema files (Context, bridging, FDC3 for Web) modified in this PR
  - [ ] If yes, was code generation (`npm run build`) run and the results checked in?
        *Generated code will be found at `/src/api/BrowserTypes.ts`,  `/src/context/ContextTypes.ts`, or `/src/bridging/BridgingTypes.ts`*
