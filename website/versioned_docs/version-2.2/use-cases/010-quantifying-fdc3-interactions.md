---
id: uc-10
title: "Use Case 10: Quantifying FDC3 Interactions"
sidebar_label: 10. Quantifying FDC3 Interactions
layout: use_case
---

## Persona
A technologist enabling users to participate in FDC3 workflows, via a desktop, web, or mobile launcher. This persona could be business or technology focused. 

## User Goal
I would like to quantify the FDC3 interactions applications participate in, so that I can understand cross-application workflows and attribute these interactions to business outcomes.

## Preconditions
The end-user's app ecosystem is typically comprised of:
- an app launcher
- multiple FDC3 compliant in-house applications, owned by different application development teams
- multiple FDC3-compliant vendor applications

## Workflow 1
For a given application, I can review all FDC3 events it has triggered and resolved, with their associated contexts. For example, intents fired, resolved, and contexts put on channels.

## Workflow 2
Subject to permissions, I can review the source applications for all FDC3 events my application is resolving, and I can review the resolving applications for all FDC3 events my application is triggering. This lets me attribute incoming and outgoing "traffic" to and from my application.

## Workflow 3
I can correlate FDC3 interactions across multiple applications, in order to understand how apps participate in a user workflow that led to an outcome. This includes all interactions from in-house and vendor apps.

## Interoperability Points
- App Directory
- API

NOTES
- Importance of uniquely identifying applications, across in-house and vendor apps, at scale (what do we think is the expected # of unique apps and interactions we will want to track?).
- Possibility of a hierarchy of apps where an intent can cascade to apps that are part of a group:
   - Do we foresee this distinction being necessary?  If so, would it suffice to know the app resolved the intent, and then 'lose' any cascading?  Or would you expect the 'cascading' to itself be an intent with resolution?
   - Ideally, we would be able to structure the reporting in such a way that consumers of the data could easily select the right level of granularity - ie grouping at different levels of hierarchy (ex: using namespacing?)
- In workflow 3 (but also consequently in 1, 2), we would we want to correlate interactions between applications or instances of applications? If we have more than one chart app open, for example, and context is passed to both or only one of them, would it be required to differentiate between the two cases?
   - Same as above - ideally, we would be able to structure the reporting in such a way the consumer of the data could easily process select the right level of granularity

## Adoption into the FDC3 Standard

| Workflow  #   |   Status Against 1.0 Standard | App Directory   | Context & Intents | API |
| :---------: |   -----  | ----- | ---------| --------- | 
| 1  |  New | -  | -  | -  |
| 2  |  New | -  | -  | -  |
| 3  |  New |  - |  - | -  |

## Adoption Metrics & Case Studies
*To be added: quantitative adoption metrics and qualitative measures of impact (case studies)*
