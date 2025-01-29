import { v4 as uuidv4 } from 'uuid';

export function createUUID(): string {
  return uuidv4();
}
