---
id: CreateInteraction
sidebar_label: CreateInteraction
title: CreateInteraction
hide_title: true
---
# `CreateInteraction`

Create a record documenting an interaction (calls, meetings, etc.) between a list of contacts.

## Intent Name

`CreateInteraction`

## Display Name

`Create Interaction`

## Possible Contexts

- [ContactList](../../context/ref/ContactList)
- [Interaction](../../context/ref/Interaction)

SHOULD return context as a result:

- [TransactionResult](../../context/ref/TransactionResult)

## Example

```js
const interaction = {
    type: 'fdc3.interaction',
    participants: {
        type: 'fdc3.contactList',
        contacts: [
            {
                type: 'fdc3.contact',
                name: 'Jane Doe',
                id: {
                    email: 'jane.doe@mail.com'
                }
             },
            {
                type: 'fdc3.contact',
                name: 'John Doe',
                id: {
                    email: 'john.doe@mail.com'
                }
            },
        ]
    },
    interactionType: 'Instant Message',
    timeRange: {
        type: 'fdc3.timeRange',
        startTime: '2022-02-10T15:12:00Z'
    },
    description: 'Laboris libero dapibus fames elit adipisicing eu, fermentum, dignissimos laboriosam, erat, risus qui deserunt. Praesentium! Reiciendis. Hic harum nostrud, harum potenti amet? Mauris. Pretium aliquid animi, eget eiusmod integer proident. Architecto ipsum blandit ducimus, possimus illum sunt illum necessitatibus ab litora sed, nonummy integer minus corrupti ducimus iste senectus accumsan, fugiat nostrud? Pede vero dictumst excepturi, iure earum consequuntur voluptatum',
    initiator:  {
        type: 'fdc3.contact',
        name: 'Jane Doe',
        id: {
            email: 'jane.doe@mail.com'
        }
    },
    origin: 'Outlook'
}

const intentResolution = await fdc3.raiseIntent('CreateInteraction', interaction);
const result = await intentResolution.getResult();
console.log(result);
```

Console log will display:

```js
{
    type: 'fdc3.transactionResult',
    status: 'Created',
    context: {
        type: 'fdc3.interaction',
        participants: {
            type: 'fdc3.contactList',
            contacts: [
                {
                    type: 'fdc3.contact',
                    name: 'Jane Doe',
                    id: {
                        email: 'jane.doe@mail.com'
                    }
                 },
                {
                    type: 'fdc3.contact',
                    name: 'John Doe',
                    id: {
                        email: 'john.doe@mail.com'
                    }
                },
            ]
        },
        interactionType: 'Instant Message',
        timeRange: {
            type: 'fdc3.timeRange',
            startTime: '2022-02-10T15:12:00Z'
        },
        description: 'Laboris libero dapibus fames elit adipisicing eu, fermentum, dignissimos laboriosam, erat, risus qui deserunt. Praesentium! Reiciendis. Hic harum nostrud, harum potenti amet? Mauris. Pretium aliquid animi, eget eiusmod integer proident. Architecto ipsum blandit ducimus, possimus illum sunt illum necessitatibus ab litora sed, nonummy integer minus corrupti ducimus iste senectus accumsan, fugiat nostrud? Pede vero dictumst excepturi, iure earum consequuntur voluptatum',
        initiator:  {
            type: 'fdc3.contact',
            name: 'Jane Doe',
            id: {
                email: 'jane.doe@mail.com'
            }
        },
        origin: 'Outlook'
        id:  {
            Singletrack: 'a0S8d000000uO05EAE'
        }
    },
    message: 'record with id "a0S8d000000uO05EAE" was created'
}
```

## See Also

Context
- [Interaction](../../context/ref/Interaction)
- [TransactionResult](../../context/ref/TransactionResult)