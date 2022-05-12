---
id: spec
sidebar_label: Intents Specification
title: Intents Specification (next)
---

## Introduction

FDC3 [Intents](intents-intro) define a standard set of verbs that, in conjunction with context data acting as nouns, can be used to put together common cross-application workflows on the financial desktop.

### Naming Conventions
Naming of Intents SHOULD follow the below guidelines:
* Intent names should be free of non-alphanumeric characters.
* ‘.’ will be used to namespace the intent (see below).
* Intent names should be in UpperCamelCase.

> **Note:** The naming guidelines should be adhered to when creating future Intents.  This is to ensure they meet the criteria for addition to the FDC3 standard and to provide a consistent user experience.

### Characteristics

When creating Intents they should be:
* Recognizable
    * Generally self-evident what the thing is
* Repeatable
    * Many instances across the industry
* Stateless
    * Workflows should not require callbacks or endpoints to maintain references to each other.  Once an Intent is passed to an endpoint - it controls the rest of that workflow.
* Specific
    * Terms should not be so open-ended that one endpoint could fulfill the Intent in a completely different way than another
* Distinct
    * Granular enough that Intent handlers can communicate key functional differences

### Namespaces ###
All standard intent names are reserved. Applications may use their own intents ad hoc.
However, there is occasionally a need for applications to ensure that their intents avoid collision, for example, where a workflow is highly specific to or internal to an application. The recommended approach is to namespace the intent with the application name. For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary intent.

### Intent Name Prefixes
Early versions of the FDC3 standard included 8 intents, which used one of two different prefixes.  The two initial prefixes were `View___` and `Start___`.  These are used to help define the behavior of the expected app when resolving the intent. 

### `View___`
  * Expected behaviour: Content should be displayed to the user.

### `Start___`
  * Expected behaviour: An interaction, such as a chat room or email thread, should be initiated.

As more use cases were identified it was clear further Intents were required.  FDC3 2.0 expanded this set to include the following:

### `Create___`
  * Expected behaviour: A new record or entity should be created. The operation should fail if it already exists.

### `Update___`
  * Expected behaviour: An existing record or entity should be updated. The operation should fail if it does not exist.

### `CreateOrUpdate___`
  * Expected behaviour: A new record or entity should be created, or an existing one updated if it exists.

### `Delete___`
  * Expected behaviour: An existing record or entity should be deleted. The operation should fail if it does not exist.

### `Get___`
  * Expected behaviour: A record or entity should be retrieved and returned as an intent result. The operation should fail if the record does not exist.

### `Share___`
  * Expected behaviour: A record or entity should shared. The operation should fail if it does not exist

## Initial Set of Standard Intents ##
A list of standardized intents are defined in the following pages:
* [`StartCall`](ref/StartCall)
* [`StartChat`](ref/StartChat)
* [`ViewChart`](ref/ViewChart)
* [`ViewContact`](ref/ViewContact)
* [`ViewQuote`](ref/ViewQuote)
* [`ViewNews`](ref/ViewNews)
* [`ViewInstrument`](ref/ViewInstrument)
* [`ViewAnalysis`](ref/ViewAnalysis)