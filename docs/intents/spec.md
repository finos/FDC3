---
id: spec
sidebar_label: Intents Specification
title: Intents Specification (next)
---

## Introduction

FDC3 [Intents](intents-intro) define a standard set of verbs that, in conjunction with context data acting as nouns, can be used to put together common cross-application workflows on the financial desktop.

### Naming Conventions

The FDC3 standard included two initial Intents which were `View___` and `Start___`.  As more use cases were identified it was clear further Intents were required.

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
Early versions of the FDC3 standard included 8 intents, which used one of two different prefixes which help to define the behavior of the expected of an app resolving the intent. FDC3 2.0 expanded this set to include the following:

### `View___`
  * Expected context: Contact

### `Start___`
  * Expected context: Contact

### `Create___`
  * Expected characteristics: Create a new record, but fail if it already exists

### `Update___`
  * Expected characteristics: Update an existing record, but fail if it does not exist

### `CreateOrUpdate___`
  * Expected characteristics: todo

### `Delete___`
  * Expected characteristics: Delete an existing record, but fail if it does not exist

### `Get___`
  * Expected characteristics: Retrieve an existing record, but fail if it does not exist

### `Share___`
  * Expected characteristics: Share an existing record, but fail if it does not exist





## Initial Set of Standard Intents ##

### `StartCall`
  * Expected context: Contact
  * Expected behavior: initiate call with contact(s)
### `StartChat`
  * Expected context: Contact
  * Expected behavior: initiate chat with contact(s)
### `ViewChart`
  * Expected context: Instrument
  * Expected behavior: display a chart for the context
### `ViewContact`
  * Expected context: Contact
  * Expected behavior: display details of a contact
### `ViewQuote`
  * Expected context: Instrument
  * Expected behavior: display pricing for an instrument
### `ViewNews`
  * Expected context: Instrument, Contact, Organization, etc.
  * Expected behavior: display news for a given context
### `ViewInstrument`
  * Expected context: Instrument
  * Expected behavior: display relevant information for a given instrument
### `ViewAnalysis`
  * Expected context: Instrument, Organization, etc.
  * Expected behavior: Send context to receiving application for displaying analysis
