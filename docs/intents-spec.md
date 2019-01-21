---
id: intents-spec
sidebar_label: Intents Specification
title: Intents Specification
hide_title: true
---

# Intents Specification (Draft)

## Introduction

FDC3 Intents define a standard set of nouns and verbs that can be used to put together common cross-application workflows on the financial desktop.  

* Applications register the Intents & Context combinations they support
* The registries support app discovery by Intent and/or Context
* Intents are not full RPC, apps don’t need to enumerate every function with an Intent
* FDC3 standard Intents are a limited set, organizations can create their own

### Syntax
* Intent names should be free of non-alphanumeric characters.   
* ‘.’ will be used to namespace the intent (see below).  
* Strings should be in UpperCamelCase.

### Characteristics

Intents shoulde be:
* Recognizable
    * Generally self-evident what the thing is
* Repeatable
    * Many instances across the industry
* Atomic
    * There should be clear lines in a workflow where the object begins and ends
* Stateless
    * Workflows should not require callbacks or endpoints to maintain references to each other.  Once an Intent is passed to an endpoint - it controls the rest of that workflow. 
* Specific
    * Terms should not be so open-ended that one endpoint could fulfill the Intent in a completely different way than another
* Distinct
    * Granular enough that Intent handlers can communicate key functional differences 

### Namespaces ###
All standard Intent names are reserved. Applications  may use their own Intents ad hoc. 
However, there is a need for applications to ensure that their Intents avoid collision. The recommended approach here is to use the app name as the noun.  For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary Intent.

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