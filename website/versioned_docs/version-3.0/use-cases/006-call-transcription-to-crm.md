---
id: uc-6
title: "Use Case 6: Call Transcription to CRM"
sidebar_label: 6. Call Transcription to CRM
layout: use_case
---

## Overview

Voice calls contain important financial information which is trapped in the audio.  These data are not easily searchable; human notetakers are prone to error; and post hoc call notes may miss crucial elements.

Real-time transcribed audio data, saved to a CRM or other record keeping system, increases data accuracy and saves users valuable time.

## Persona(s)

Anyone who uses the phone to conduct business and needs to record contents.  Examples include:

1. an analyst calling into an earnings call
1. salesperson on a call with a customer
1. a meeting attendee capturing their notes

## Workflows

This transcription workflow consists of multiple workflows for gathering an audio stream.  Each of these Alternate Inputs below could use traditional telephony, or a software client.  The output of the finished transcription is sent to a CRM.

### During live call

1. During a live call, which might be a group call with multiple users, one user conferences in transcription service.
1. Parties converse as normal, while transcription service turns audio to text.
1. At conclusion of call, transcription service sends completed transcript and metadata to CRM

### Post-call dictation

1. After an event is concluded, the user initiates a dictation client (possibly a softphone)
1. User speaks their notes into a microphone.
1. Transcription service transcribes audio into text.
1. Transcription service sends completed transcript and metadata to CRM.

## Interoperability Points

Each of these 2 handoffs:  client → transcription service → CRM , represent interoperability points for FDC3.  All 3 may be from separate providers.

The transcription service → CRM handoff may have an intermediary step where the user selects the 2nd party in their CRM as target for saving (this may potentially be automated with sufficiently rich metadata), or even which CRM or destination to save the data.

## FDC3 Working groups affected

- Intents Working Group
- Contexts Working Group
