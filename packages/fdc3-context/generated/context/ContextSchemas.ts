/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

// THIS IS A GENERATED FILE - DO NOT EDIT.
// Regenerate with `npm run generate` (see generateContextSchemas.cjs).
// Source of truth: packages/fdc3-context/schemas/context/*.schema.json

/**
 * The JSON Schema definitions for every standardized FDC3 context type, keyed
 * by their context `type` identifier (e.g. `"fdc3.instrument"`). Prefer the
 * accessor helpers exported from the package root (`getContextSchema`,
 * `getContextTypes`, etc.) over reading this object directly.
 */
export const contextSchemas: Record<string, Record<string, unknown>> = {
  'fdc3.action': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/action.schema.json',
    title: 'Action',
    description:
      'A representation of an FDC3 Action (specified via a Context or Context & Intent) that can be inserted inside another object, for example a chat message.\n\nThe action may be completed by calling:\n- `fdc3.raiseIntent()` with the specified Intent and Context\n- `fdc3.raiseIntentForContext()` if only a context is specified, (which the Desktop Agent will resolve by presenting the user with a list of available Intents for the Context).\n- `channel.broadcast()` with the specified Context, if the `broadcast` action has been defined.\n\nAccepts an optional `app` parameter in order to specify a specific app.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.action',
          },
          action: {
            title: 'Action Type',
            description:
              'The **action** field indicates the type of action:\n- **raiseIntent** :  If no action or `raiseIntent` is specified, then `fdc3.raiseIntent` or `fdc3.raiseIntentForContext` will be called with the specified context (and intent if given).\n- **broadcast** : If `broadcast` and a `channelId` are specified then `fdc3.getOrCreateChannel(channelId)` is called to retrieve the channel and broadcast the context to it with `channel.broadcast(context)`. If no `channelId` has been specified, the context should be broadcast to the current channel (`fdc3.broadcast()`)',
            type: 'string',
            enum: ['broadcast', 'raiseIntent'],
          },
          title: {
            title: 'Action Title',
            description: 'A human readable display name for the action',
            type: 'string',
          },
          intent: {
            title: 'Action Intent',
            description:
              'Optional Intent to raise to perform the actions. Should reference an intent type name, such as those defined in the FDC3 Standard. If intent is not set then `fdc3.raiseIntentForContext` should be used to perform the action as this will usually allow the user to choose the intent to raise.',
            type: 'string',
          },
          context: {
            title: 'Action Context',
            description: 'A context object with which the action will be performed',
            $ref: 'context.schema.json#',
          },
          channelId: {
            title: 'Channel ID',
            description:
              'Optional channel on which to broadcast the context. The `channelId` property is ignored unless the `action` is broadcast.',
            type: 'string',
          },
          app: {
            title: 'Action Target App',
            description:
              'An optional target application identifier that should perform the action. The `app` property is ignored unless the action is raiseIntent.',
            $ref: '../api/api.schema.json#/definitions/AppIdentifier',
          },
        },
        required: ['title', 'context'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.action',
        action: 'raiseIntent',
        title: 'Click to view Chart',
        intent: 'ViewChart',
        context: {
          type: 'fdc3.chart',
          instruments: [
            {
              type: 'fdc3.instrument',
              id: {
                ticker: 'EURUSD',
              },
            },
          ],
          range: {
            type: 'fdc3.dateRange',
            starttime: '2020-09-01T08:00:00.000Z',
            endtime: '2020-10-31T08:00:00.000Z',
          },
          style: 'candle',
        },
        app: {
          appId: 'MyChartViewingApp',
          instanceId: 'instance1',
        },
      },
      {
        type: 'fdc3.action',
        action: 'broadcast',
        channelId: 'Channel 1',
        title: 'Click to view Chart',
        context: {
          type: 'fdc3.chart',
          instruments: [
            {
              type: 'fdc3.instrument',
              id: {
                ticker: 'EURUSD',
              },
            },
          ],
          range: {
            type: 'fdc3.dateRange',
            starttime: '2020-09-01T08:00:00.000Z',
            endtime: '2020-10-31T08:00:00.000Z',
          },
          style: 'candle',
        },
      },
    ],
  },
  'fdc3.chart': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/chart.schema.json',
    type: 'object',
    title: 'Chart',
    description:
      'A context type representing details of a Chart, which may be used to request plotting of a particular chart or to otherwise share details of its composition, such as:\n\n- A list of instruments for comparison\n- The time period to plot the chart over\n- The style of chart (line, bar, mountain, candle etc.)\n- Other settings such as indicators to calculate, or data representing drawings and annotations.\n\nIn addition to handling requests to plot charts, a charting application may use this type to output a representation of what it is currently displaying so that it can be recorded by another application.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.chart',
          },
          instruments: {
            title: 'Instruments to plot',
            description: 'An array of instrument contexts whose data should be plotted.',
            type: 'array',
            items: {
              $ref: 'instrument.schema.json#',
            },
          },
          range: {
            title: 'Time Range',
            description: 'The time range that should be plotted',
            $ref: 'timeRange.schema.json#',
          },
          style: {
            title: 'Chart style',
            description: 'The type of chart that should be plotted',
            type: 'string',
            enum: [
              'line',
              'bar',
              'stacked-bar',
              'mountain',
              'candle',
              'pie',
              'scatter',
              'histogram',
              'heatmap',
              'custom',
            ],
          },
          otherConfig: {
            title: 'Other configuration',
            description:
              'It is common for charts to support other configuration, such as indicators, annotations etc., which do not have standardized formats, but may be included in the `otherConfig` array as context objects.',
            type: 'array',
            items: {
              $ref: 'context.schema.json#',
            },
          },
        },
        required: ['instruments'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.chart',
        instruments: [
          {
            type: 'fdc3.instrument',
            id: {
              ticker: 'AAPL',
            },
          },
          {
            type: 'fdc3.instrument',
            id: {
              ticker: 'GOOG',
            },
          },
        ],
        range: {
          type: 'fdc3.timeRange',
          startTime: '2020-09-01T08:00:00.000Z',
          endTime: '2020-10-31T08:00:00.000Z',
        },
        style: 'line',
        otherConfig: [
          {
            type: 'somevendor.someproduct.indicator',
            name: 'stddev',
            parameters: {
              period: 10,
              matype: 'exponential',
            },
          },
          {
            type: 'someothervendor.someotherproduct.formula',
            formula: 'standard-deviation',
            fields: {
              lookback: 10,
              type: 'ema',
            },
          },
        ],
      },
    ],
  },
  'fdc3.chat.initSettings': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/chatInitSettings.schema.json',
    type: 'object',
    title: 'ChatInitSettings',
    description: 'A collection of settings to start a new chat conversation',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.chat.initSettings',
          },
          chatName: {
            title: 'Chat name',
            description: 'Name to apply to the chat created',
            type: 'string',
          },
          members: {
            title: 'Chat members',
            description: 'Contacts to add to the chat',
            $ref: 'contactList.schema.json#',
          },
          message: {
            title: 'Initial chat message',
            description: 'An initial message to post in the chat when created.',
            oneOf: [
              {
                type: 'string',
              },
              {
                $ref: 'message.schema.json#',
              },
            ],
          },
          options: {
            title: 'Chat options',
            description: 'Option settings that affect the creation of the chat',
            type: 'object',
            properties: {
              groupRecipients: {
                title: 'Group recipients option',
                description: 'if false a separate chat will be created for each member',
                type: 'boolean',
              },
              isPublic: {
                title: 'Public chat option',
                description: 'if true the room will be visible to everyone in the chat application',
                type: 'boolean',
              },
              allowHistoryBrowsing: {
                title: 'Allow history browsing option',
                description: 'if true members will be allowed to browse past messages',
                type: 'boolean',
              },
              allowMessageCopy: {
                title: 'Allow message copy option',
                description: 'if true members will be allowed to copy/paste messages',
                type: 'boolean',
              },
              allowAddUser: {
                title: 'All adding users option',
                description: 'if true members will be allowed to add other members to the chat',
                type: 'boolean',
              },
            },
          },
        },
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.chat.initSettings',
        chatName: 'Chat ABCD',
        members: {
          type: 'fdc3.contactList',
          contacts: [
            {
              type: 'fdc3.contact',
              name: 'Jane Doe',
              id: {
                email: 'jane@mail.com',
              },
            },
            {
              type: 'fdc3.contact',
              name: 'John Doe',
              id: {
                email: 'john@mail.com',
              },
            },
          ],
        },
        options: {
          groupRecipients: true,
          isPublic: false,
          allowHistoryBrowsing: true,
          allowMessageCopy: true,
        },
        message: {
          type: 'fdc3.message',
          text: {
            'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot',
          },
          entities: {
            '0': {
              type: 'fdc3.fileAttachment',
              data: {
                name: 'myImage.png',
                dataUri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
              },
            },
          },
        },
      },
    ],
  },
  'fdc3.chat.message': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/chatMessage.schema.json',
    type: 'object',
    title: 'ChatMessage',
    description:
      'A context representing a chat message. Typically used to send the message or to pre-populate a message for sending.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.chat.message',
          },
          chatRoom: {
            $ref: 'chatRoom.schema.json#',
          },
          message: {
            $ref: 'message.schema.json#',
          },
        },
        required: ['type', 'chatRoom', 'message'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.chat.message',
        chatRoom: {
          type: 'fdc3.chat.room',
          providerName: 'Symphony',
          id: {
            streamId: 'j75xqXy25NBOdacUI3FNBH',
          },
        },
        message: {
          type: 'fdc3.message',
          text: {
            'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot',
          },
          entities: {
            '0': {
              type: 'fdc3.fileAttachment',
              data: {
                name: 'myImage.png',
                dataUri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
              },
            },
          },
        },
      },
    ],
  },
  'fdc3.chat.room': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/chatRoom.schema.json',
    type: 'object',
    title: 'ChatRoom',
    description: 'Reference to the chat room which could be used to send a message to the room',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.chat.room',
          },
          providerName: {
            title: 'Chat provider name',
            description: 'The name of the service that hosts the chat',
            type: 'string',
          },
          id: {
            title: 'Chat room id',
            description: 'Identifier(s) for the chat - currently unstandardized',
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          url: {
            title: 'Chat URL',
            description: 'Universal url to access to the room. It could be opened from a browser, a mobile app, etc...',
            type: 'string',
            format: 'uri',
          },
          name: {
            title: 'Chat name',
            description: 'Display name for the chat room',
            type: 'string',
          },
        },
        required: ['providerName', 'id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.chat.room',
        providerName: 'Symphony',
        id: {
          streamId: 'j75xqXy25NBOdacUI3FNBH',
        },
        url: 'http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA',
        name: 'My new room',
      },
    ],
  },
  'fdc3.chat.searchCriteria': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/chatSearchCriteria.schema.json',
    type: 'object',
    title: 'ChatSearchCriteria',
    description:
      'A context type that represents a simple search criterion, based on a list of other context objects, that can be used to search or filter messages in a chat application.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.chat.searchCriteria',
          },
          criteria: {
            title: 'Search Criteria array',
            description:
              'An array of criteria that should match chats returned from by a search.\n\n⚠️ Operators (and/or/not) are not defined in `fdc3.chat.searchCriteria`. It is up to the application that processes the FDC3 Intent to choose and apply the operators between the criteria.\n\nEmpty search criteria can be supported to allow resetting of filters.',
            type: 'array',
            items: {
              $ref: '#/$defs/SearchCriteria',
            },
          },
        },
        required: ['criteria'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    $defs: {
      SearchCriteria: {
        title: 'Search Criteria',
        description:
          'An individual criteria against which to match chat messages, based on an FDC3 context or free-text string.',
        oneOf: [
          {
            $ref: 'instrument.schema.json#',
          },
          {
            $ref: 'organization.schema.json#',
          },
          {
            $ref: 'contact.schema.json#',
          },
          {
            type: 'string',
          },
        ],
      },
    },
    examples: [
      {
        type: 'fdc3.chat.searchCriteria',
        criteria: [
          {
            type: 'fdc3.contact',
            name: 'Jane Doe',
            id: {
              email: 'jane.doe@mail.com',
            },
          },
          {
            type: 'fdc3.instrument',
            id: {
              ticker: 'TSLA',
            },
            name: 'Tesla, inc.',
          },
          'annual return',
        ],
      },
    ],
  },
  'fdc3.contact': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/contact.schema.json',
    type: 'object',
    title: 'Contact',
    description: 'A person contact that can be engaged with through email, calling, messaging, CMS, etc.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.contact',
          },
          id: {
            type: 'object',
            title: 'Contact Identifiers',
            description: 'Identifiers that relate to the Contact represented by this context',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                title: 'Email address',
                description: 'The email address for the contact',
              },
              FDS_ID: {
                type: 'string',
                title: 'FDS ID',
                description: 'FactSet Permanent Identifier representing the contact',
              },
            },
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the contact',
          },
        },
        required: ['id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.contact',
        name: 'Jane Doe',
        id: {
          email: 'jane.doe@mail.com',
        },
      },
    ],
  },
  'fdc3.contactList': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/contactList.schema.json',
    type: 'object',
    title: 'ContactList',
    description:
      'A collection of contacts, e.g. for chatting to or calling multiple contacts.\n\nThe contact list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.contactList',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Contact List Identifiers',
            description:
              'One or more identifiers that refer to the contact list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable summary of the contact list',
          },
          contacts: {
            type: 'array',
            title: 'List of Contacts',
            description: 'An array of contact contexts that forms the list.',
            items: {
              $ref: 'contact.schema.json#',
            },
          },
        },
        required: ['contacts'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.contactList',
        contacts: [
          {
            type: 'fdc3.contact',
            name: 'Jane Doe',
            id: {
              email: 'jane.doe@mail.com',
            },
          },
          {
            type: 'fdc3.contact',
            name: 'John Doe',
            id: {
              email: 'john.doe@mail.com',
            },
          },
        ],
      },
    ],
  },
  'fdc3.country': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/country.schema.json',
    type: 'object',
    title: 'Country',
    description:
      'A country entity.\n\nNotes:\n\n- It is valid to include extra properties and metadata as part of the country payload, but the minimum requirement is for at least one standardized identifier to be provided\n\n  - `COUNTRY_ISOALPHA2` SHOULD be preferred.\n\n- Try to only use country identifiers as intended and specified in the [ISO standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `COUNTRY_ISOALPHA2` property must be a recognized value and not a proprietary two-letter code. If the identifier you want to share is not a standardized and recognized one, rather define a property that makes it clear what value it is. This makes it easier for target applications.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.country',
          },
          id: {
            type: 'object',
            properties: {
              COUNTRY_ISOALPHA2: {
                type: 'string',
                title: 'COUNTRY_ISOALPHA2',
                description: 'Two-letter ISO country code',
              },
              COUNTRY_ISOALPHA3: {
                type: 'string',
                title: 'COUNTRY_ISOALPHA3',
                description: 'Three-letter ISO country code',
              },
              ISOALPHA2: {
                type: 'string',
                title: 'ISOALPHA2',
                description:
                  'Two-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.',
                deprecated: true,
              },
              ISOALPHA3: {
                type: 'string',
                title: 'ISOALPHA3',
                description:
                  'Three-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.',
                deprecated: true,
              },
            },
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the country',
          },
        },
        required: ['id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.country',
        name: 'Sweden',
        id: {
          COUNTRY_ISOALPHA2: 'SE',
        },
      },
    ],
  },
  'fdc3.currency': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/currency.schema.json',
    type: 'object',
    title: 'Currency',
    description: 'A context representing an individual Currency.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.currency',
          },
          name: {
            type: 'string',
            title: 'Currency name',
            description: 'The name of the currency for display purposes',
          },
          id: {
            type: 'object',
            properties: {
              CURRENCY_ISOCODE: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
                title: 'CURRENCY_ISOCODE',
                description:
                  'The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)',
              },
            },
          },
        },
        required: ['id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.currency',
        name: 'US Dollar',
        id: {
          CURRENCY_ISOCODE: 'USD',
        },
      },
    ],
  },
  'fdc3.email': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/email.schema.json',
    type: 'object',
    title: 'Email',
    description: 'A collection of information to be used to initiate an email with a Contact or ContactList.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.email',
          },
          recipients: {
            title: 'Email Recipients',
            description: 'One or more recipients for the email.',
            oneOf: [
              {
                $ref: 'contact.schema.json#',
              },
              {
                $ref: 'contactList.schema.json#',
              },
            ],
          },
          subject: {
            title: 'Email Subject',
            description: 'Subject line for the email.',
            type: 'string',
          },
          textBody: {
            title: 'Email Body',
            description: 'Body content for the email.',
            type: 'string',
          },
        },
        required: ['recipients'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.email',
        recipients: {
          type: 'fdc3.contact',
          name: 'Jane Doe',
          id: {
            email: 'jane.doe@example.com',
          },
        },
        subject: 'The information you requested',
        textBody: 'Blah, blah, blah ...',
      },
    ],
  },
  'fdc3.fileAttachment': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/fileAttachment.schema.json',
    type: 'object',
    title: 'File Attachment',
    description: 'A File attachment encoded in the form of a data URI. Can be added to a Message.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.fileAttachment',
          },
          data: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'File name',
                description: 'The name of the attached file',
              },
              dataUri: {
                type: 'string',
                format: 'uri',
                title: '',
                description: 'A data URI encoding the content of the file to be attached',
              },
            },
            required: ['name', 'dataUri'],
          },
        },
        required: ['type', 'data'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.fileAttachment',
        data: {
          name: 'myImage.png',
          dataUri:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        },
      },
    ],
  },
  'fdc3.instrument': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/instrument.schema.json',
    type: 'object',
    title: 'Instrument',
    description: 'A financial instrument from any asset class.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.instrument',
          },
          id: {
            title: 'Instrument identifiers',
            description:
              'Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match. Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified. In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.\n\nIt is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement is for at least one instrument identifier to be provided.\n\nTry to only use instrument identifiers as intended. E.g. the `ticker` property is meant for tickers as used by an exchange.\nIf the identifier you want to share is not a ticker or one of the other standardized fields, define a property that makes it clear what the value represents. Doing so will make interpretation easier for the developers of target applications.',
            type: 'object',
            properties: {
              BBG: {
                type: 'string',
                title: 'Bloomberg security',
                description: 'https://www.bloomberg.com/',
              },
              CUSIP: {
                type: 'string',
                title: 'CUSIP',
                description: 'https://www.cusip.com/',
              },
              FDS_ID: {
                type: 'string',
                title: 'FactSet Permanent Security Identifier',
                description: 'https://www.factset.com/',
              },
              FIGI: {
                type: 'string',
                title: 'Open FIGI',
                description: 'https://www.openfigi.com/',
              },
              ISIN: {
                type: 'string',
                title: 'ISIN',
                description: 'https://www.isin.org/',
              },
              PERMID: {
                type: 'string',
                title: 'Refinitiv PERMID',
                description: 'https://permid.org/',
              },
              RIC: {
                type: 'string',
                title: 'Refinitiv Identification Code',
                description: 'https://www.refinitiv.com/',
              },
              SEDOL: {
                type: 'string',
                title: 'SEDOL',
                description: 'https://www.lseg.com/sedol',
              },
              ticker: {
                type: 'string',
                title: 'Stock ticker',
                description: 'Unstandardized stock tickers',
              },
            },
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the instrument',
          },
          market: {
            description:
              'The `market` map can be used to further specify the instrument and help achieve interoperability between disparate data sources. This is especially useful when using an `id` field that is not globally unique.',
            type: 'object',
            properties: {
              MIC: {
                type: 'string',
                title: 'Market Identifier Code',
                description: 'https://en.wikipedia.org/wiki/Market_Identifier_Code',
              },
              name: {
                type: 'string',
                title: 'Market Name',
                description: 'Human readable market name',
              },
              COUNTRY_ISOALPHA2: {
                type: 'string',
                title: 'Country ISO Code',
                description: 'https://www.iso.org/iso-3166-country-codes.html',
              },
              BBG: {
                type: 'string',
                title: 'Bloomberg Market Identifier',
                description: 'https://www.bloomberg.com/',
              },
            },
            unevaluatedProperties: {
              type: 'string',
            },
          },
          classification: {
            title: 'Instrument Classification',
            description:
              '@experimental The `classification` map can be used to specify the categorization of the instrument and help achieve interoperability between disparate data sources.',
            type: 'object',
            properties: {
              name: {
                type: 'string',
                title: 'FDC3 Instrument Classification Name',
                description:
                  'Optional human-readable classification, to be used if no specific data classification is available.',
              },
              FDS_TYPE: {
                title: 'FactSet Type',
                description: 'FactSet classification for the instrument.',
                type: 'string',
                enum: [
                  'commodity',
                  'commodityIndex',
                  'corporateDebt',
                  'creditDefaultSwapIndex',
                  'deal',
                  'debt',
                  'debtIndex',
                  'etf',
                  'fixedIncome',
                  'future',
                  'governmentBenchmarkDebt',
                  'loan',
                  'mortgageBackedSecurity',
                  'municipalDebt',
                  'mutualFund',
                  'mutualFundIndex',
                  'option',
                  'otherDebt',
                  'ownershipPrivateCompany',
                  'pevcFirm',
                  'pevcFund',
                  'privateCompany',
                  'publicCompany',
                  'publicCompanyIndex',
                  'sovereignDebt',
                  'structuredProduct',
                  'unknown',
                ],
              },
            },
          },
        },
        required: ['type', 'id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.instrument',
        name: 'Microsoft',
        id: {
          ticker: 'MSFT',
          RIC: 'MSFT.OQ',
          ISIN: 'US5949181045',
        },
        market: {
          MIC: 'XNAS',
        },
        classification: {
          name: 'publicCompany',
        },
      },
    ],
  },
  'fdc3.instrumentList': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/instrumentList.schema.json',
    type: 'object',
    title: 'InstrumentList',
    description:
      'A collection of instruments. Use this type for use cases that require not just a single instrument, but multiple (e.g. to populate a watchlist). However, when holding information for each instrument is required, it is recommended to use the [Portfolio](Portfolio) type.\n\nThe instrument list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.instrumentList',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Instrument List Identifiers',
            description:
              'One or more identifiers that refer to the instrument list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable summary of the instrument list',
          },
          instruments: {
            type: 'array',
            title: 'List of instruments',
            description: 'An array of instrument contexts that forms the list.',
            items: {
              $ref: 'instrument.schema.json#',
            },
          },
        },
        required: ['instruments'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.instrumentList',
        instruments: [
          {
            type: 'fdc3.instrument',
            id: {
              ticker: 'AAPL',
            },
            market: {
              MIC: 'XNAS',
            },
          },
          {
            type: 'fdc3.instrument',
            id: {
              ISIN: 'US5949181045',
            },
          },
        ],
      },
    ],
  },
  'fdc3.interaction': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/interaction.schema.json',
    type: 'object',
    title: 'Interaction',
    description:
      'An `Interaction` is a significant direct exchange of ideas or information between a number of participants, e.g. a Sell Side party and one or more Buy Side parties. An `Interaction` might be a call, a meeting (physical or virtual), an IM or the preparation of some specialist data, such as financial data for a given company or sector.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.interaction',
          },
          id: {
            type: 'object',
            title: 'Interaction Id',
            description:
              'Can be used by a target application to pass an identifier back to the originating application after an interaction record has been created, updated or deleted. An interaction ID does not need to be populated by the originating application, however the target application could store it for future reference and SHOULD return it in a `TransactionResult`.',
            properties: {
              URI: {
                type: 'string',
                title: 'Interaction URI',
                description:
                  "Can be used by a target application to pass a record's link back to the originating application. This offers the originating application a way to open the record for a user to view.",
              },
              SALESFORCE: {
                type: 'string',
                title: 'Salesforce ID',
                description: 'Interactions ID in Salesforce',
              },
              SINGLETRACK: {
                type: 'string',
                title: 'SingleTrack ID',
                description: 'Interaction ID in SingleTrack',
              },
            },
          },
          participants: {
            title: 'Interaction Participants',
            description: 'A list of contacts involved in the interaction',
            $ref: 'contactList.schema.json#',
          },
          timeRange: {
            title: 'Interaction Time range',
            description: 'The time range over which the interaction occurred',
            $ref: 'timeRange.schema.json#',
          },
          interactionType: {
            title: 'Interaction Type',
            description:
              "`interactionType` SHOULD be one of `'Instant Message'`, `'Email'`, `'Call'`, or `'Meeting'` although other string values are permitted.",
            type: 'string',
          },
          description: {
            title: 'Interaction Description',
            description: 'A human-readable description of the interaction',
            type: 'string',
          },
          initiator: {
            title: 'Interaction Initiator',
            description: 'The contact that initiated the interaction',
            $ref: 'contact.schema.json#',
          },
          origin: {
            title: 'Interaction Origin',
            description:
              'Used to represent the application or service that the interaction was created from to aid in tracing the source of an interaction.',
            type: 'string',
          },
        },
        required: ['participants', 'timeRange', 'interactionType', 'description'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.interaction',
        participants: {
          type: 'fdc3.contactList',
          contacts: [
            {
              type: 'fdc3.contact',
              name: 'Jane Doe',
              id: {
                email: 'jane.doe@mail.com',
              },
            },
            {
              type: 'fdc3.contact',
              name: 'John Doe',
              id: {
                email: 'john.doe@mail.com',
              },
            },
          ],
        },
        interactionType: 'Instant Message',
        timeRange: {
          type: 'fdc3.timeRange',
          startTime: '2022-02-10T15:12:00Z',
        },
        description:
          'Laboris libero dapibus fames elit adipisicing eu, fermentum, dignissimos laboriosam, erat, risus qui deserunt. Praesentium! Reiciendis. Hic harum nostrud, harum potenti amet? Mauris. Pretium aliquid animi, eget eiusmod integer proident. Architecto ipsum blandit ducimus, possimus illum sunt illum necessitatibus ab litora sed, nonummy integer minus corrupti ducimus iste senectus accumsan, fugiat nostrud? Pede vero dictumst excepturi, iure earum consequuntur voluptatum',
        initiator: {
          type: 'fdc3.contact',
          name: 'Jane Doe',
          id: {
            email: 'jane.doe@mail.com',
          },
        },
        origin: 'Outlook',
      },
    ],
  },
  'fdc3.message': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/message.schema.json',
    type: 'object',
    title: 'Message',
    description:
      'A chat message to be sent through an instant messaging application. Can contain one or several text bodies (organized by mime-type, plaintext or markdown), as well as attached entities (either arbitrary file attachments or FDC3 actions to be embedded in the message). To be put inside a ChatInitSettings object.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.message',
          },
          text: {
            type: 'object',
            title: 'Message text',
            description: 'A map of string mime-type to string content',
            properties: {
              'text/plain': {
                type: 'string',
                title: 'Plain text',
                description: 'Plain text encoded content.',
              },
              'text/markdown': {
                title: 'Markdown text',
                description: 'Markdown encoded content',
                type: 'string',
              },
            },
          },
          entities: {
            type: 'object',
            title: 'Message entities',
            description:
              'A map of string IDs to entities that should be attached to the message, such as an action to perform, a file attachment, or other FDC3 context object.',
            additionalProperties: {
              oneOf: [
                {
                  $ref: 'action.schema.json#',
                },
                {
                  $ref: 'fileAttachment.schema.json#',
                },
              ],
            },
          },
        },
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.message',
        text: {
          'text/plain':
            'Hey all, can we discuss the issue together? I attached a screenshot and a link to the current exchange rate',
        },
        entities: {
          picture1: {
            type: 'fdc3.fileAttachment',
            data: {
              name: 'myImage.png',
              dataUri:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
            },
          },
          eurusd_action: {
            type: 'fdc3.action',
            title: 'Click to view Chart',
            intent: 'ViewChart',
            context: {
              type: 'fdc3.chart',
              instruments: [
                {
                  type: 'fdc3.instrument',
                  id: {
                    ticker: 'EURUSD',
                  },
                },
              ],
              range: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-01T08:00:00.000Z',
                endtime: '2020-10-31T08:00:00.000Z',
              },
              style: 'candle',
            },
          },
        },
      },
    ],
  },
  'fdc3.nothing': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/nothing.schema.json',
    type: 'object',
    title: 'Nothing',
    description:
      'A type that explicitly represents a lack of context.\n\nNotes:\n\n- Intended to be used in situations where no context is desired.\n- For example:\n  - Raising an intent without context (e.g. opening a blank order form, or chat interface without a contact selected).\n  - Resetting context on a channel (e.g. when context is used to set a filter in other applications a null context might release the filter).\n- An explicit representation of a Null or empty context allows apps to declare support for a lack of context, for example in their intent metadata in an app directory.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.nothing',
          },
        },
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.nothing',
      },
    ],
  },
  'fdc3.order': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/order.schema.json',
    type: 'object',
    title: 'Order',
    description:
      '@experimental context type representing an order. To be used with OMS and EMS systems.\n\nThis type currently only defines a required `id` field, which should provide a reference to the order in one or more systems, an optional human readable `name` field to be used to summarize the order and an optional `details` field that may be used to provide additional detail about the order, including a context representing a `product`, which may be extended with arbitrary properties. The `details.product` field is currently typed as a unspecified Context type, but both `details` and `details.product` are expected to be standardized in future.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.order',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Order Identifiers',
            description:
              'One or more identifiers that refer to the order in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable summary of the order.',
          },
          details: {
            type: 'object',
            title: 'Order Details',
            description:
              'Optional additional details about the order, which may include a product element that is an, as yet undefined but extensible, Context',
            properties: {
              product: {
                $ref: 'product.schema.json',
              },
            },
            additionalProperties: true,
          },
          notes: {
            type: 'string',
            title: 'Order Notes',
            description: 'Additional notes or comments about the order.',
          },
        },
        required: ['type', 'id'],
        additionalProperties: true,
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.order',
        name: '...',
        notes: '...',
        id: {
          myOMS: '12345',
        },
        details: {
          product: {
            type: 'fdc3.product',
            id: {
              productId: 'ABC123',
            },
            instrument: {
              type: 'fdc3.instrument',
              id: {
                ticker: 'MSFT',
              },
            },
          },
        },
      },
      {
        type: 'fdc3.order',
        id: {
          myOMS: 'ABC123',
        },
      },
    ],
  },
  'fdc3.orderList': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/orderList.schema.json',
    type: 'object',
    title: 'OrderList',
    description:
      '@experimental A list of orders. Use this type for use cases that require not just a single order, but multiple.\n\nThe OrderList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.orderList',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Order List Identifiers',
            description:
              'One or more identifiers that refer to the order list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable summary of the order list',
          },
          orders: {
            type: 'array',
            items: {
              $ref: 'order.schema.json#',
            },
            title: 'List of Orders',
            description: 'An array of order contexts that forms the list.',
          },
        },
        required: ['type', 'orders'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.orderList',
        orders: [
          {
            type: 'fdc3.order',
            id: {
              myOMS: 'ABC123',
            },
          },
          {
            type: 'fdc3.order',
            id: {
              myOMS: 'DEF456',
            },
          },
        ],
      },
    ],
  },
  'fdc3.organization': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/organization.schema.json',
    type: 'object',
    title: 'Organization',
    description:
      'An entity that can be used when referencing private companies and other organizations where a specific instrument is not available or desired e.g. CRM and News workflows.\n\nIt is valid to include extra properties and metadata as part of the organization payload, but the minimum requirement is for at least one specified identifier to be provided.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.organization',
          },
          id: {
            type: 'object',
            title: 'Organization Identifiers',
            description: 'Identifiers for the organization, at least one must be provided.',
            minProperties: 1,
            properties: {
              LEI: {
                type: 'string',
                title: 'Legal Entity Identifier',
                description:
                  'The Legal Entity Identifier (LEI) is a 20-character, alpha-numeric code based on the ISO 17442 standard developed by the International Organization for Standardization (ISO). It connects to key reference information that enables clear and unique identification of legal entities participating in financial transactions.',
              },
              PERMID: {
                type: 'string',
                title: 'Organization',
                description: 'Refinitiv Permanent Identifiers, or PermID for the organization',
              },
              FDS_ID: {
                type: 'string',
                title: 'Organization',
                description: 'FactSet Permanent Identifier representing the organization',
              },
            },
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name of the organization',
          },
        },
        required: ['id'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.organization',
        name: 'Cargill, Incorporated',
        id: {
          LEI: 'QXZYQNMR4JZ5RIRN4T31',
          FDS_ID: '00161G-E',
        },
      },
    ],
  },
  'fdc3.portfolio': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/portfolio.schema.json',
    type: 'object',
    title: 'Portfolio',
    description:
      'A financial portfolio made up of multiple positions (holdings) in several instruments. Contrast this with e.g. the [InstrumentList](InstrumentList) type, which is just a list of instruments.\n\nThis is a good example of how types can be composed and extended with extra properties to define more complex types.\n\nThe Portfolio type consists of an array of [Position](Position) types, each of which refers to a single [Instrument](Instrument) and a holding amount for that instrument.\n\nThe portfolio schema does not explicitly include identifiers in the `id` section, as there bis not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.portfolio',
          },
          positions: {
            type: 'array',
            items: {
              $ref: 'position.schema.json#',
            },
            title: 'Portfolio positions',
            description: 'The List of Positions which make up the Portfolio',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Portfolio Identifiers',
            description:
              'One or more identifiers that refer to the portfolio in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the portfolio',
          },
        },
        required: ['positions'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.portfolio',
        positions: [
          {
            type: 'fdc3.position',
            instrument: {
              type: 'fdc3.instrument',
              id: {
                ticker: 'AAPL',
              },
            },
            holding: 2000000,
          },
          {
            type: 'fdc3.position',
            instrument: {
              type: 'fdc3.instrument',
              id: {
                ticker: 'MSFT',
              },
            },
            holding: 1500000,
          },
          {
            type: 'fdc3.position',
            instrument: {
              type: 'fdc3.instrument',
              id: {
                ticker: 'IBM',
              },
            },
            holding: 3000000,
          },
        ],
      },
    ],
  },
  'fdc3.position': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/position.schema.json',
    type: 'object',
    title: 'Position',
    description:
      'A financial position made up of an instrument and a holding in that instrument. This type is a good example of how new context types can be composed from existing types.\n\nIn this case, the instrument and the holding amount for that instrument are required values.\n\nThe [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type, which represents multiple holdings in a combination of instruments.\n\nThe position schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.position',
          },
          instrument: {
            $ref: 'instrument.schema.json#',
            title: 'The financial instrument that this position relates to',
            description: '',
          },
          holding: {
            type: 'number',
            title: 'The size of the holding represented by this position',
            description: 'The amount of the holding, e.g. a number of shares',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Position Identifiers',
            description:
              'One or more identifiers that refer to the position in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the position',
          },
        },
        required: ['instrument', 'holding'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.position',
        instrument: {
          type: 'fdc3.instrument',
          id: {
            ticker: 'AAPL',
          },
        },
        holding: 2000000,
      },
    ],
  },
  'fdc3.product': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/product.schema.json',
    type: 'object',
    title: 'Product',
    description:
      '@experimental context type representing a tradable product. To be used with OMS and EMS systems.\n\nThis type is currently only loosely defined as an extensible context object, with an optional instrument field.\n\nThe Product schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.product',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Product Identifiers',
            description:
              'One or more identifiers that refer to the product. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Product Name',
            description: 'A human-readable summary of the product.',
          },
          instrument: {
            $ref: 'instrument.schema.json',
            title: 'Product Instrument',
            description: 'A financial instrument that relates to the definition of this product',
          },
          notes: {
            type: 'string',
            title: 'Product Notes',
            description: 'Additional notes or comments about the product.',
          },
        },
        required: ['type', 'id'],
        additionalProperties: true,
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.product',
        notes: '...',
        id: {
          productId: 'ABC123',
        },
        instrument: {
          type: 'fdc3.instrument',
          id: {
            ticker: 'MSFT',
          },
        },
      },
    ],
  },
  'fdc3.security.encryptedContext': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/encrypted.schema.json',
    type: 'object',
    title: 'Encrypted Context Wrapper',
    description:
      "@experimental A wrapper context type for encrypted FDC3 context data. When an app broadcasts encrypted context data, the original type is preserved for routing purposes, while the remaining context information is encrypted. Recipients can request a symmetric key via 'fdc3.security.symmetricKeyRequest' to decrypt the payload.",
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.security.encryptedContext',
          },
          originalType: {
            type: 'string',
            description:
              "The original FDC3 context type that was encrypted (e.g., 'fdc3.instrument', 'fdc3.contact'). This field is used by the desktop agent and context handlers for routing decisions.",
          },
          id: {
            type: 'object',
            description: 'Identifiers for the encryption key used.',
            properties: {
              kid: {
                type: 'string',
                description: 'Key ID identifying the symmetric key used to encrypt the payload.',
              },
            },
            required: ['kid'],
            additionalProperties: true,
          },
          encryptedPayload: {
            type: 'string',
            description:
              "The encrypted context data as a base64-encoded string. Contains all fields from the original context except for the type. Encrypted using the symmetric key identified by 'id.kid'.",
          },
        },
        required: ['type', 'originalType', 'id', 'encryptedPayload'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.instrument',
        id: {
          kid: 'channel-key-abc123',
        },
        encryptedPayload: 'eyJuYW1lIjoiQXBwbGUiLCJpZCI6eyJ0aWNrZXIiOiJBQVBMIn19...',
      },
      {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.contact',
        id: {
          kid: 'session-key-xyz789',
        },
        encryptedPayload: 'eyJuYW1lIjoiSm9obiBEb2UiLCJpZCI6eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifX0=...',
      },
    ],
  },
  'fdc3.security.symmetricKeyRequest': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/symmetricKeyRequest.schema.json',
    type: 'object',
    title: 'Symmetric Key Request',
    description:
      "@experimental A request to obtain a symmetric encryption key for decrypting encrypted context on a channel.\n\n**Note:** This context type MUST be signed to be effective. The key owner uses the signature's public key URL to encrypt the symmetric key in the response, ensuring only the requesting application can decrypt it. See the [Security & Identity documentation](../../api/security) for details on signing context objects and encrypted communications.",
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.security.symmetricKeyRequest',
          },
          id: {
            type: 'object',
            description: 'Optional identifier for the requested key.',
            properties: {
              kid: {
                type: 'string',
                description: 'Key ID to request a specific symmetric key.',
              },
            },
            additionalProperties: true,
          },
        },
        required: ['type'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.security.symmetricKeyRequest',
      },
      {
        type: 'fdc3.security.symmetricKeyRequest',
        id: {
          kid: 'channel-key-abc123',
        },
      },
    ],
  },
  'fdc3.security.symmetricKeyResponse': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/symmetricKeyResponse.schema.json',
    type: 'object',
    title: 'Symmetric Key Response',
    description: '@experimental A response containing a wrapped symmetric key and metadata.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.security.symmetricKeyResponse',
          },
          id: {
            type: 'object',
            properties: {
              kid: {
                type: 'string',
                description: 'Key ID used to identify the public key used to wrap the symmetric key.',
              },
              pki: {
                type: 'string',
                description: 'Public Key Infrastructure JSON Web Key Set URL used to wrap the symmetric key.',
              },
            },
            required: ['kid', 'pki'],
          },
          wrappedKey: {
            type: 'string',
            description: "The symmetric key, encrypted using the recipient's public key.",
            examples: ['u4jvA7...=='],
          },
        },
        required: ['type', 'id', 'wrappedKey'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.security.symmetricKeyResponse',
        id: {
          kid: 'key-id-123',
          pki: 'https://examples.com/myJWKSendpoint',
        },
        wrappedKey: 'u4jvA7Gx8LdH...==',
      },
    ],
  },
  'fdc3.security.user': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/user.schema.json',
    type: 'object',
    title: 'User',
    description:
      '@experimental A user identity, expressed as a wrapped JWT.  Receivers will need to unwrap the JWT using their own private key.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.security.user',
          },
          wrappedJwt: {
            type: 'string',
            description:
              "A JSON Web Token (JWT) asserting user identity and permissions, wrapped in the public key of the requester. The JWT contains a header with cryptographic information and a payload with user claims. Header fields include: 'alg' (signature algorithm, e.g., 'EdDSA'), 'jku' (JSON Web Key Set URL for key verification), and 'kid' (key identifier). Payload fields include: 'iss' (issuer - the application issuing the token), 'aud' (audience - the intended recipient application), 'sub' (subject - the user identifier), 'exp' (expiration time as Unix timestamp), 'iat' (issued at time as Unix timestamp), and 'jti' (JWT ID - unique token identifier).",
          },
        },
        required: ['type', 'wrappedJwt'],
      },
    ],
    examples: [
      {
        type: 'fdc3.security.user',
        wrappedJwt: '--example-jwt-token--but-wrapped-in-the-public-key-of-the-requester--',
      },
    ],
  },
  'fdc3.security.userRequest': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/userRequest.schema.json',
    type: 'object',
    title: 'User Request',
    description:
      "@experimental A request for the current user's identity, raised via the GetUser intent. An identity provider app receives this request and responds with an 'fdc3.security.user' context containing a signed JWT wrapped in the requester's public key. The request includes the requesting application's audience identifier needed for the identity provider app to create a token bound to that application and to encrypt the response.\n\n**Note:** This context type MUST be signed to be effective. The identity provider app uses the signature's public key URL to verify the requesting application's identity and to encrypt the response. See the [Security & Identity documentation](../../api/security) for details on signing context objects.",
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.security.userRequest',
            description:
              'The FDC3 context type identifier. Used by desktop agents and context handlers to route this request to appropriate identity providers.',
          },
          aud: {
            type: 'string',
            format: 'uri',
            description:
              "The audience identifier for the returned JWT, typically the URL of the requesting application. The identity provider will embed this value in the JWT's 'aud' claim, allowing the requesting application to verify that the token was issued specifically for it. This prevents token misuse if intercepted by other applications.",
          },
        },
        required: ['type', 'aud'],
        additionalProperties: true,
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.security.userRequest',
        aud: 'https://my-app-url.com',
      },
    ],
  },
  'fdc3.timeRange': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/timeRange.schema.json',
    type: 'object',
    title: 'TimeRange',
    description:
      'A context representing a period of time. Any user interfaces that represent or visualize events or activity over time can be filtered or focused on a particular time period, e.g.:\n\n- A pricing chart\n- A trade blotter\n- A record of client contact/activity in a CRM\n\nExample use cases:\n\n- User may want to view pricing/trades/customer activity for a security over a particular time period, the time range might be specified as the context for the `ViewChart` intent OR it might be embedded in another context (e.g. a context representing a chart to plot).\n- User filters a visualization (e.g. a pricing chart) to show a particular period, the `TimeRange` is broadcast and other visualizations (e.g. a heatmap of activity by instrument, or industry sector etc.) receive it and filter themselves to show data over the same range.\n\nNotes:\n\n- A `TimeRange` may be closed (i.e. `startTime` and `endTime` are both known) or open (i.e. only one of `startTime` or `endTime` is known).\n- Ranges corresponding to dates (e.g. `2022-05-12` to `2022-05-19`) should be specified using times as this prevents issues with timezone conversions and inclusive/exclusive date ranges.\n- String fields representing times are encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html).\n  - A timezone indicator should be specified, e.g. `"2022-05-12T15:18:03Z"` or `"2022-05-12T16:18:03+01:00"`\n  - Times MAY be specified with millisecond precision, e.g. `"2022-05-12T15:18:03.349Z"`',
    allOf: [
      {
        properties: {
          type: {
            const: 'fdc3.timeRange',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            title: 'Start Time',
            description:
              'The start time of the range, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            title: 'End Time',
            description:
              'The end time of the range, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.',
          },
        },
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    anyOf: [
      {
        required: ['startTime', 'endTime'],
      },
      {
        required: ['startTime'],
      },
      {
        required: ['endTime'],
      },
    ],
    examples: [
      {
        type: 'fdc3.timeRange',
        startTime: '2022-03-30T15:44:44Z',
        endTime: '2022-04-30T23:59:59Z',
      },
      {
        type: 'fdc3.timeRange',
        startTime: '2022-03-30T15:44:44+00:00',
      },
      {
        type: 'fdc3.timeRange',
        endTime: '2022-03-30T16:44:44.123Z',
      },
    ],
  },
  'fdc3.trade': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/trade.schema.json',
    type: 'object',
    title: 'Trade',
    description:
      '@experimental context type representing a trade. To be used with execution systems.\n\nThis type currently only defines a required `id` field, which should provide a reference to the trade in one or more systems, an optional human readable `name` field to be used to summarize the trade and a required `product` field that may be used to provide additional detail about the trade, which is currently typed as a unspecified Context type, but `product` is expected to be standardized in future.\n\n The Trade schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.trade',
          },
          id: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
            title: 'Trade Identifiers',
            description:
              'One or more identifiers that refer to the trade in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
          },
          name: {
            type: 'string',
            title: 'Trade Name',
            description: 'A human-readable summary of the trade.',
          },
          product: {
            $ref: 'product.schema.json',
            title: 'Traded product',
            description: 'A product that is the subject of the trade.',
          },
          notes: {
            type: 'string',
            title: 'Trade Notes',
            description: 'Additional notes or comments about the trade.',
          },
        },
        required: ['type', 'id', 'product'],
        additionalProperties: true,
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.trade',
        name: '...',
        notes: '...',
        id: {
          myEMS: '12345',
        },
        product: {
          type: 'fdc3.product',
          id: {
            productId: 'ABC123',
          },
          instrument: {
            type: 'fdc3.instrument',
            id: {
              ticker: 'MSFT',
            },
          },
        },
      },
    ],
  },
  'fdc3.tradeList': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/tradeList.schema.json',
    type: 'object',
    title: 'TradeList',
    description:
      '@experimental A list of trades. Use this type for use cases that require not just a single trade, but multiple.\n\nThe TradeList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.tradeList',
          },
          trades: {
            title: 'List of Trades',
            description: 'An array of trade contexts that forms the list.',
            type: 'array',
            items: {
              $ref: 'trade.schema.json#',
            },
          },
          id: {
            title: 'Trade List Identifiers',
            description:
              'One or more identifiers that refer to the trade list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.',
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'An optional human-readable name for the trade list',
          },
        },
        required: ['type', 'trades'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.tradeList',
        trades: [
          {
            type: 'fdc3.trade',
            name: '...',
            id: {
              myEMS: '12345',
            },
            product: {
              type: 'fdc3.product',
              id: {
                productId: 'ABC123',
              },
              instrument: {
                type: 'fdc3.instrument',
                id: {
                  ticker: 'MSFT',
                },
              },
            },
          },
          {
            type: 'fdc3.trade',
            id: {
              myEMS: '67890',
            },
            product: {
              type: 'fdc3.product',
              id: {
                productId: 'DEF456',
              },
              instrument: {
                type: 'fdc3.instrument',
                id: {
                  ticker: 'TSLA',
                },
              },
            },
          },
        ],
      },
    ],
  },
  'fdc3.transactionResult': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/transactionresult.schema.json',
    type: 'object',
    title: 'TransactionResult',
    description:
      'A context type representing the result of a transaction initiated via FDC3, which SHOULD be returned as an `IntentResult` by intents that create, retrieve, update or delete content or records in another application. Its purpose is to provide a status and message (where needed) for the transaction and MAY wrap a returned context object.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.transactionResult',
          },
          status: {
            type: 'string',
            enum: ['Created', 'Deleted', 'Updated', 'Failed'],
            title: 'Transaction Status',
            description: 'The status of the transaction being reported.',
          },
          context: {
            $ref: 'context.schema.json#',
            title: 'Transaction Result Context',
            description: 'A context object returned by the transaction, possibly with updated data.',
          },
          message: {
            type: 'string',
            title: 'Transaction Message',
            description: 'A human readable message describing the outcome of the transaction.',
          },
        },
        required: ['type', 'status'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.transactionResult',
        status: 'Updated',
        context: {
          type: 'fdc3.contact',
          name: 'Jane Doe',
          id: {
            email: 'jane.doe@mail.com',
          },
        },
        message: "record with id 'jane.doe@mail.com' was updated",
      },
    ],
  },
  'fdc3.valuation': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://fdc3.finos.org/schemas/next/context/valuation.schema.json',
    type: 'object',
    title: 'Valuation',
    description: 'A context type representing the price and value of a holding.',
    allOf: [
      {
        type: 'object',
        properties: {
          type: {
            const: 'fdc3.valuation',
          },
          value: {
            type: 'number',
            title: 'Value',
            description: 'The value of the holding, expresses in the nominated currency.',
          },
          price: {
            type: 'number',
            title: 'Price per unit',
            description: 'The price per unit the the valuation is based on.',
          },
          CURRENCY_ISOCODE: {
            type: 'string',
            pattern: '^[A-Z]{3}$',
            title: 'Valuation Currency',
            description:
              'The valuation currency, which should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)',
          },
          valuationTime: {
            type: 'string',
            format: 'date-time',
            title: 'Valuation time',
            description:
              'The time at which the valuation was performed, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.',
          },
          expiryTime: {
            type: 'string',
            format: 'date-time',
            title: 'Expiry Time',
            description:
              'The time at which this valuation expires, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.',
          },
        },
        required: ['value', 'CURRENCY_ISOCODE'],
      },
      {
        $ref: 'context.schema.json#/definitions/BaseContext',
      },
    ],
    examples: [
      {
        type: 'fdc3.valuation',
        value: 500,
        price: 5,
        CURRENCY_ISOCODE: 'USD',
        expiryTime: '2022-05-13T16:16:24+01:00',
      },
    ],
  },
};
