/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { StandardContextType } from '../context/ContextType.js';
import { StandardIntent } from '../intents/Intents.js';
import { StandardContextsSet } from '../internal/contextConfiguration.js';
import { StandardIntentsSet } from '../internal/intentConfiguration.js';
import { ContextType } from '../context/ContextType.js';
import { Intent } from '../intents/Intents.js';
import { ImplementationMetadata } from './ImplementationMetadata.js';

/**
 * Check if the given context is a standard context type.
 * @param contextType
 */
export function isStandardContextType(contextType: ContextType): contextType is StandardContextType {
  return StandardContextsSet.has(contextType as StandardContextType);
}

/**
 * Check if the given intent is a standard intent.
 * @param intent
 */
export function isStandardIntent(intent: Intent): intent is StandardIntent {
  return StandardIntentsSet.has(intent as StandardIntent);
}

/**
 * Compare numeric semver version number strings (in the form `1.2.3`).
 *
 * Returns `-1` if the first argument is a lower version number than the second,
 * `1` if the first argument is greater than the second, 0 if the arguments are
 * equal and `null` if an error occurred during the comparison.
 *
 * @param a
 * @param b
 */
export const compareVersionNumbers: (a: string, b: string) => number | null = (a, b) => {
  try {
    const aVerArr = a.split('.').map(Number);
    const bVerArr = b.split('.').map(Number);
    for (let index = 0; index < Math.max(aVerArr.length, bVerArr.length); index++) {
      /* If one version number has more digits and the other does not, and they are otherwise equal,
         assume the longer is greater. E.g. 1.1.1 > 1.1 */
      if (index === aVerArr.length || aVerArr[index] < bVerArr[index]) {
        return -1;
      } else if (index === bVerArr.length || aVerArr[index] > bVerArr[index]) {
        return 1;
      }
    }
    return 0;
  } catch (e) {
    console.error('Failed to compare version strings', e);
    return null;
  }
};

/**
 * Check if the FDC3 version in an ImplementationMetadata object is greater than
 * or equal to the supplied numeric semver version number string (in the form `1.2.3`).
 *
 * Returns a boolean or null if an error occurred while comparing the version numbers.
 *
 * @param metadata
 * @param version
 */
export const versionIsAtLeast: (metadata: ImplementationMetadata, version: string) => boolean | null = (
  metadata,
  version
) => {
  const comparison = compareVersionNumbers(metadata.fdc3Version, version);
  return comparison === null ? null : comparison >= 0 ? true : false;
};
