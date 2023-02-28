---
sidebar_label: Intents Specification
title: Intents Specification 1.1
original_id: spec
---

## Introduction

FDC3 [Intents](../intents/overview) define a standard set of nouns and verbs that can be used to put together common cross-application workflows on the financial desktop.

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
All standard Intent names are reserved. Applications may use their own Intents ad hoc.
However, there is a need for applications to ensure that their Intents avoid collision. The recommended approach here is to use the app name as the noun. For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary Intent.

## Initial Set of Standard Intents ##

### StartCall
  * Expected Context: Contact
  * Expected behavior: initiate call with contact(s)
### StartChat
  * Expected Context: Contact
  * Expected behavior: initiate chat with contact(s)
### ViewChart
  * Expected Context: Instrument
  * Expected behavior: display a chart for the context
### ViewContact
  * Expected Context: Contact
  * Expected behavior: display details of a contact
### ViewQuote
  * Expected Context: Instrument
  * Expected behavior: display pricing for an instrument
### ViewNews
  * Expected Context: Instrument, Contact, Organisation, etc.
  * Expected behavior: display news for a given context
### ViewInstrument
  * Expected Context: Instrument
  * Expected behavior: display relevant information for a given instrument
### ViewAnalysis
  * Expected Context: Instrument, Organization, etc.
  * Expected behavior: Send context to receiving application for displaying analysis
