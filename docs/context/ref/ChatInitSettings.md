---
title: ChatInitSettings
sidebar_label: ChatInitSettings

---

# ChatInitSettings

A collection of settings to start a new chat conversation

## Schema

[https://fdc3.finos.org/schemas/next/context/chatInitSettings.schema.json](https://fdc3.finos.org/schemas/next/context/chatInitSettings.schema.json) ([github](https://github.com/finos/FDC3/tree/main/schemas/context/chatInitSettings.schema.json))

## Type

`fdc3.chat.initSettings`

## Properties

<details>
  <summary><code>chatName</code></summary>

**type**: `string`

Name to apply to the chat created

</details>

<details>
  <summary><code>members</code></summary>

**type**: [ContactList](ContactList)

Contacts to add to the chat

</details>

<details>
  <summary><code>message</code></summary>

**One of:**

- **type**: `string`
- **type**: [Message](Message)

An initial message to post in the chat when created.

</details>

<details>
  <summary><code>options</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>groupRecipients</code></summary>

**type**: `boolean`

if false a separate chat will be created for each member

</details>

<details>
  <summary><code>isPublic</code></summary>

**type**: `boolean`

if true the room will be visible to everyone in the chat application

</details>

<details>
  <summary><code>allowHistoryBrowsing</code></summary>

**type**: `boolean`

if true members will be allowed to browse past messages

</details>

<details>
  <summary><code>allowMessageCopy</code></summary>

**type**: `boolean`

if true members will be allowed to copy/paste messages

</details>

<details>
  <summary><code>allowAddUser</code></summary>

**type**: `boolean`

if true members will be allowed to add other members to the chat

</details>

Option settings that affect the creation of the chat

</details>

## Example

```json
{
  "type": "fdc3.chat.initSettings",
  "chatName": "Chat ABCD",
  "members": {
    "type": "fdc3.contactList",
    "contacts": [
      {
        "type": "fdc3.contact",
        "name": "Jane Doe",
        "id": {
          "email": "jane@mail.com"
        }
      },
      {
        "type": "fdc3.contact",
        "name": "John Doe",
        "id": {
          "email": "john@mail.com"
        }
      }
    ]
  },
  "options": {
    "groupRecipients": true,
    "isPublic": false,
    "allowHistoryBrowsing": true,
    "allowMessageCopy": true
  },
  "message": {
    "type": "fdc3.message",
    "text": {
      "text/plain": "Hey all, can we discuss the issue together? I attached a screenshot"
    },
    "entities": {
      "0": {
        "type": "fdc3.fileAttachment",
        "data": {
          "name": "myImage.png",
          "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
        }
      }
    }
  }
}
```

