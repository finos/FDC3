---
id: use-case-7
title: Use Case 7: Platform agnostic interop API
sidebar_label: Use Case 7: Platform agnostic interop API
layout: use_case
---

As an in-house CTO I have multiple development teams producing multiple applications that will be delivered to the same set of users. In order to provide an improved user experience, avoid application silos and to allow a more incremental development and release process, I need an interop system to allow these applications to work together.

I have an old in-house Interop system and I am also evaluating multiple 3rd party interop systems. I want a platform agnostic interop API to allow my dev teams to produce and enhance their applications whilst I chose a system and also to allow these applications to run on a new platform. This is useful to avoid vendor lock and also because it allows my applications to run on different platforms which can be useful when different parts of the organisation run different platforms.

Examining existing interop services I determine that there are three core capabilities of most such systems:
- Request / Response interactions.
- Streaming interactions.
- Run time discovery of servers.

## Workflow 1
I want to encourage my dev teams to produce applications that can work together to provide a coherent user experience across the applications. This requires the ability for one application to interact with another using any of the following:

- running a new instance of an application as per the Intent user case.
- broadcasting changes to Context to relevant applications.
- Moving focus to another application, selecting a particular sub-view.

NB this require knowledge of the called application but such interactions are common with in-house applications.


## Workflow 2
I also want to create high level shared components such as sophisticated client and instrument search windows which can be used by multiple applications.

These shared components are used by other applications.

NB I cannot have these components created as shareable widgets since my dev teams use multiple technologies and within JavaScript use multiple frameworks.

## Workflow 3
I want my inhouse applications to be able to integrate with 3rd party applications.
