---
id: spec
sidebar_label: Intents Specification
title: Intents Specification (next)
---

## Introduction

FDC3 [Intents](intents-intro) define a standard set of verbs that, in conjunction with context data acting as nouns, can be used to put together common cross-application workflows on the financial desktop.

### Naming Syntax
* Intent names should be free of non-alphanumeric characters.
* ‘.’ will be used to namespace the intent (see below).
* Intent names should be in UpperCamelCase.

### Characteristics

Intents shoulde be:
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
However, there is a need for applications to ensure that their intents avoid collision. The recommended approach here is to use the app name as the noun. For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary intent.

## Standard Intents ##

### [StartCall](ref/StartCall)
  * Expected context: Contact
  * Expected behavior: initiate call with contact(s)
### [StartChat](ref/StartChat)
  * Expected context: Contact
  * Expected behavior: initiate chat with contact(s)
### [ViewChart](ref/ViewChart)
  * Expected context: Instrument
  * Expected behavior: display a chart for the context
### [ViewQuote](ref/ViewQuote)
  * Expected context: Instrument
  * Expected behavior: display pricing for an instrument
### [ViewNews](ref/ViewNews)
  * Expected context: Instrument, Contact, Organization, etc.
  * Expected behavior: display news for a given context
### [ViewAnalysis](ref/ViewAnalysis)
* Expected context: Instrument, Organization, etc.
* Expected behavior: Send context to receiving application for displaying analysis
### [ViewInstrument](ref/ViewInstrument)
  * Expected context: Instrument
  * Expected behavior: display relevant information for a given instrument
### [ViewHoldings](ref/ViewHoldings)
* Expected context: Instrument, InstrumentList, Organization
* Expected behavior: Display any holdings for the provided instrument, list of instruments, or organization
### [ViewProfile](ref/ViewProfile)
* Expected context: Contact, Organization
* Expected behavior: Display basic profile information for individual or organization
### [ViewResearch](ref/ViewResearch)
* Expected context: Contact, Instrument, Organization
* Expected behavior: Show research related to an instrument, an individual or organization

## Deprecated Intents ##

### [ViewContact](ref/ViewContact)
* Expected context: Contact
* Expected behavior: display details of a contact
