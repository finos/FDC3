/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { ContextItem } from '../store/ContextStore.js';
import { v4 as uuidv4 } from 'uuid';

export const contexts: ContextItem[] = [
  {
    uuid: uuidv4(),
    id: 'Action example',
    template: {
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
          type: 'fdc3.timeRange',
          startTime: '2020-09-01T08:00:00.000Z',
          endTime: '2020-10-31T08:00:00.000Z',
        },
        style: 'candle',
      },
      app: {
        appId: 'MyChartViewingApp',
        instanceId: 'instance1',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/action.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Chart example',
    template: {
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
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/chart.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Chat Initialization example',
    template: {
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
        groupRecipients: true, // one chat with both contacts
        isPublic: false, // private chat room
        allowHistoryBrowsing: true,
        allowMessageCopy: true,
      },
      message: {
        type: 'fdc3.message',
        text: {
          'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot',
        },
        entities: {
          0: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/chatInitSettings.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Chat Message example',
    template: {
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
          0: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/chatMessage.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Chat room example',
    template: {
      type: 'fdc3.chat.room',
      providerName: 'Symphony',
      id: {
        streamId: 'j75xqXy25NBOdacUI3FNBH',
      },
      url: 'http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA',
      name: 'My new room',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/chatRoom.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Chat search example',
    template: {
      type: 'fdc3.chat.searchCriteria',
      criteria: [
        {
          type: 'fdc3.instrument',
          id: {
            ticker: 'AAPL',
          },
        },
        {
          type: 'fdc3.contact',
          name: 'Jane Doe',
          id: {
            email: 'jane.doe@mail.com',
          },
        },
        {
          type: 'fdc3.organization',
          name: 'Symphony',
          id: {
            FDS_ID: 'SYMPHONY',
          },
        },
        '#OrderID45788422',
      ],
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/chatSearchCriteria.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Contact example',
    template: {
      type: 'fdc3.contact',
      name: 'Jane Doe',
      id: {
        email: 'jane.doe@mail.com',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/contact.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'ContactList example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/contactList.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Country example',
    template: {
      type: 'fdc3.country',
      name: 'Sweden',
      id: {
        ISOALPHA3: 'SWE',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/country.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Currency example',
    template: {
      type: 'fdc3.currency',
      name: 'US Dollar',
      id: {
        CURRENCY_ISOCODE: 'USD',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/currency.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Email example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/email.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'File attachment example',
    template: {
      type: 'fdc3.fileAttachment',
      data: {
        name: 'myImage.png',
        dataUri:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/fileAttachment.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Instrument example - MSFT',
    template: {
      type: 'fdc3.instrument',
      name: 'Microsoft',
      id: {
        ticker: 'MSFT',
        RIC: 'MSFT.OQ',
        ISIN: 'US5949181045',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/instrument.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Instrument example - AAPL',
    template: {
      type: 'fdc3.instrument',
      name: 'Apple',
      id: {
        ticker: 'AAPL',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/instrument.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'InstrumentList example',
    template: {
      type: 'fdc3.instrumentList',
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
            ticker: 'MSFT',
          },
        },
      ],
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/instrumentList.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Interaction example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/interaction.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Message example',
    template: {
      type: 'fdc3.message',
      text: {
        'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot and a chart link.',
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
        viewChart: {
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
              type: 'fdc3.timeRange',
              startTime: '2020-09-01T08:00:00.000Z',
              endTime: '2020-10-31T08:00:00.000Z',
            },
            style: 'candle',
          },
        },
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/message.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Nothing example',
    template: {
      type: 'fdc3.nothing',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/nothing.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Order example',
    template: {
      type: 'fdc3.order',
      name: '...',
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/order.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'OrderList example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/orderList.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Organization example',
    template: {
      type: 'fdc3.organization',
      name: 'Cargill, Incorporated',
      id: {
        LEI: 'QXZYQNMR4JZ5RIRN4T31',
        FDS_ID: '00161G-E',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/organization.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Position example',
    template: {
      type: 'fdc3.position',
      instrument: {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL',
        },
      },
      holding: 2000000,
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/position.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Portfolio example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/portfolio.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Product example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/product.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Security encrypted context example',
    template: {
      type: 'fdc3.security.encryptedContext',
      originalType: 'fdc3.instrument',
      id: {
        kid: 'channel-key-abc123',
      },
      encryptedPayload: 'eyJuYW1lIjoiQXBwbGUiLCJpZCI6eyJ0aWNrZXIiOiJBQVBMIn19...',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/encrypted.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Security symmetric key request example',
    template: {
      type: 'fdc3.security.symmetricKeyRequest',
      id: {
        kid: 'channel-key-abc123',
      },
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/symmetricKeyRequest.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Security symmetric key response example',
    template: {
      type: 'fdc3.security.symmetricKeyResponse',
      id: {
        kid: 'key-id-123',
        pki: 'https://examples.com/myJWKSendpoint',
      },
      wrappedKey: 'u4jvA7Gx8LdH...==',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/symmetricKeyResponse.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Security user example',
    template: {
      type: 'fdc3.security.user',
      wrappedJwt: '--example-jwt-token--but-wrapped-in-the-public-key-of-the-requester--',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/user.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Security user request example',
    template: {
      type: 'fdc3.security.userRequest',
      aud: 'https://my-app-url.com',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/userRequest.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'TimeRange example',
    template: {
      type: 'fdc3.timeRange',
      startTime: '2022-03-30T15:44:44Z',
      endTime: '2022-04-30T23:59:59Z',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/timeRange.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Trade example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/trade.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'TradeList example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/tradeList.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Transaction result example',
    template: {
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
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/transactionresult.schema.json'),
  },
  {
    uuid: uuidv4(),
    id: 'Valuation example',
    template: {
      type: 'fdc3.valuation',
      value: 500.0,
      price: 5.0,
      CURRENCY_ISOCODE: 'USD',
      expiryTime: '2022-05-13T16:16:24+01:00',
    },
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context/valuation.schema.json'),
  },
];
