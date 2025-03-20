---
id: uc-9
title: "Use Case 9: Sales Floor Base Workflow"
sidebar_label: 9. Sales Floor Base Workflow
layout: use_case
---

## Overview
This use case focus on workflow efficiency and heavy reliant on better tools integration with central focus on a CRM. A CRM application with good analytics is central part in any sales business, enabling its integration with the traditional financial  applications is key to make users life as easy as possible.

## Workflow 1
1. A phone contact happens, the user is in the office using a physical line (e.g. Turret);
1. The CRM automatically is setup in the page relevant to the customer (lets consider that the CRM is FDC3 compliant);
1. Relevant Analytical tools are automatically set based on the customer profile (this can include any type of analytics - products, customer history, etc.);
1. Relevant dealing tools, credit check tools, pricing tools are automatically set based on the customer profile;
1. A deal is agreed and the user uses the relevant tools to register the deal;
1. When the call ends a CRM call report popup form is shown prefilled with a NLP prepossessed call summary, call statistics (when, how much time, phone number, etc..) and deals registered; 
>* While aware of the technical challenges for NLP in this scenario, that shouldn't make a huge difference for the FDC3 api layer if other path is chosen for this step.
1. The user edits if required and saves the call report.

## Workflow 2
1. A chat contact happens;
1. The CRM automatically is setup in the page relevant to the customer (lets consider that the CRM is FDC3 compliant);
1. Relevant Analytical tools are automatically set based on the customer profile (this can include any type of analytics - products, customer history, etc.);
1. While on the chat it triggers a request for analytics on a specific item delivered by another FDC3 compliant app (e.g. Bond, FX... );
1. Relevant dealing tools, credit check tools, pricing tools are automatically set based on the customer profile;
1. A deal is agreed and the user uses the relevant tools to register the deal;
1. When the call ends, the user can trigger from the chat a CRM call report, a popup is shown prefilled with a NLP prepossessed chat summary and deals registered; 
1. The user edits if required and saves the call report.

## Interoperability Points
- API
- Context data
- App Directory
