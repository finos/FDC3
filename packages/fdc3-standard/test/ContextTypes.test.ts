import { describe, it, expect } from 'vitest';
import { Convert, Contact } from '@finos/fdc3-context';

const json = '{ "type": "fdc3.contact", "id": { "email": "joe@mail.com" } }';
const contact: Contact = {
  type: 'fdc3.contact',
  id: {
    email: 'joe@mail.com',
  },
};

// To be expanded
describe('Context types', () => {
  it('Convert contact from json', () => {
    expect(Convert.toContact(json)).toEqual(contact);
  });

  it('Convert contact to json', () => {
    expect(JSON.parse(Convert.contactToJson(contact))).toEqual(JSON.parse(json));
  });
});
