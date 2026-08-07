/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context, EncryptedContextWrapper, SymmetricKeyResponse, User, UserRequest } from '@finos/fdc3-context';
import { Channel, ContextMetadata, ContextWithMetadata, IntentResult } from '@finos/fdc3-standard';

/**
 * Returns true if `value` is a FDC3 `Context` object (has a string `type` property
 * and is not a Channel result type).
 */
export function isContext(value: unknown): value is Context {
  return typeof value === 'object' && value !== null && 'type' in value && typeof (value as Context).type === 'string';
}

/**
 * Returns true if `value` is a `ContextWithMetadata` object — i.e. a `{ context, metadata }`
 * pair rather than a bare `Context`.
 */
export function isContextWithMetadata(value: unknown): value is ContextWithMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'context' in value &&
    'metadata' in value &&
    isContext((value as ContextWithMetadata).context)
  );
}

/**
 * Returns true if `value` is a Channel intent result (type is 'user', 'app', or 'private').
 */
export function isChannelResult(value: IntentResult): value is Channel {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    ((value as Channel).type === 'user' || (value as Channel).type === 'app' || (value as Channel).type === 'private')
  );
}

/**
 * Returns true if `value` is a `SymmetricKeyResponse` context.
 */
export function isSymmetricKeyResponse(value: Context): value is SymmetricKeyResponse {
  return value.type === 'fdc3.security.symmetricKeyResponse' && 'wrappedKey' in value && 'id' in value;
}

/**
 * Returns true if `value` is an `EncryptedContextWrapper` context.
 */
export function isEncryptedContextWrapper(value: Context): value is EncryptedContextWrapper {
  return (
    value.type === 'fdc3.security.encryptedContext' &&
    'originalType' in value &&
    'encryptedPayload' in value &&
    'id' in value
  );
}

/**
 * Returns true if `value` is a `User` context (fdc3.security.user with a wrappedJwt string).
 */
export function isUser(value: Context): value is User {
  return value.type === 'fdc3.security.user' && 'wrappedJwt' in value && typeof (value as User).wrappedJwt === 'string';
}

/**
 * Returns true if `value` is a `UserRequest` context (fdc3.security.userRequest with an aud string).
 */
export function isUserRequest(value: Context): value is UserRequest {
  return value.type === 'fdc3.security.userRequest' && 'aud' in value && typeof (value as UserRequest).aud === 'string';
}

/**
 * Returns true if `value` is a `ContextMetadata` object (has `source` and `timestamp`).
 */
export function isContextMetadata(value: unknown): value is ContextMetadata {
  return typeof value === 'object' && value !== null && 'source' in value && 'timestamp' in value;
}

/**
 * Asserts that `value` is a `Context`, throwing a descriptive error if not.
 * Use this after excluding Channel and void results from `IntentResult`.
 */
export function assertIsContext(value: unknown, location: string): asserts value is Context {
  if (!isContext(value)) {
    throw new Error(`${location}: expected a Context object but received ${JSON.stringify(value)}`);
  }
}

/**
 * Asserts that `value` is defined (not null or undefined), throwing a descriptive error if not.
 * Use this when an `exchangeData` or `getResult` call must return a value.
 */
export function assertDefined<T>(value: T | null | undefined, location: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${location}: expected a value but received ${value}`);
  }
}
