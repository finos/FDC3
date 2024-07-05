---
title: ChatInitSettings
description: A collection of settings to start a new chat conversation
sidebar_label: ChatInitSettings

---

# ChatInitSettings

A collection of settings to start a new chat conversation

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/chatInitSettings.schema.json>

## Type

`fdc3.chat.initSettings`

## Properties

### `chatName`

Name to apply to the chat created

**Type**: `string`


**Example Value**: 
`Chat ABCD`

### `members`

Contacts to add to the chat

**Reference**: [contactList](../contactList)


**Example Value**: 
```json
{
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
}
```

### `message`

An initial message to post in the chat when created.


**Example Value**: 
```json
{
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
```

### `options`

Option settings that affect the creation of the chat

**Type**: `object`

#### Subproperties
##### groupRecipients
- Type: `boolean`
- Description: `if false a separate chat will be created for each member`

##### isPublic
- Type: `boolean`
- Description: `if true the room will be visible to everyone in the chat application`

##### allowHistoryBrowsing
- Type: `boolean`
- Description: `if true members will be allowed to browse past messages`

##### allowMessageCopy
- Type: `boolean`
- Description: `if true members will be allowed to copy/paste messages`

##### allowAddUser
- Type: `boolean`
- Description: `if true members will be allowed to add other members to the chat`


**Example Value**: 
```json
{
  "groupRecipients": true,
  "isPublic": false,
  "allowHistoryBrowsing": true,
  "allowMessageCopy": true
}
```

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

