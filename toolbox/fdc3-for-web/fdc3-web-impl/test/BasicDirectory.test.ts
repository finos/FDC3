import { describe, expect, it } from 'vitest';
import {
  BasicDirectory,
  FDC3_VERSION_RANGE_PATTERN,
  appSupportsFdc3Version,
  genericResultTypeSame,
} from '../src/directory/BasicDirectory.js';
import { DirectoryApp } from '../src/directory/DirectoryInterface.js';

function app(appId: string, fdc3Version?: string): DirectoryApp {
  return {
    appId,
    title: appId,
    type: 'web',
    details: { url: `https://example.com/${appId}` },
    ...(fdc3Version == null ? {} : { fdc3Version }),
  };
}

describe('BasicDirectory FDC3 version filtering', () => {
  it('includes apps with no FDC3 version metadata', () => {
    expect(appSupportsFdc3Version(app('unversioned'), '3.0')).toBe(true);
  });

  it('uses npm-style semver ranges to include compatible apps', () => {
    expect(appSupportsFdc3Version(app('exact', '2.2'), '2.2')).toBe(true);
    expect(appSupportsFdc3Version(app('caret', '^2.2'), '2.3')).toBe(true);
    expect(appSupportsFdc3Version(app('tilde', '~2.3'), '2.3')).toBe(true);
    expect(appSupportsFdc3Version(app('minimum', '>=2.2'), '3.0')).toBe(true);
    expect(appSupportsFdc3Version(app('spaced-comparator', '>= 2.2'), '3.0')).toBe(true);
  });

  it('excludes apps with incompatible or invalid FDC3 version metadata', () => {
    expect(appSupportsFdc3Version(app('maximum', '<=2.2'), '3.0')).toBe(false);
    expect(appSupportsFdc3Version(app('invalid', 'not-a-version'), '2.2')).toBe(false);
    expect(appSupportsFdc3Version(app('invalid-comparator', '^^2.2'), '2.2')).toBe(false);
    expect(appSupportsFdc3Version(app('patch-version', '1.2.3'), '1.2')).toBe(false);
    expect(appSupportsFdc3Version(app('valid-range', '^2.2'), 'not-a-version')).toBe(false);
  });

  it('rejects long invalid ranges without catastrophic backtracking', () => {
    const repeatedVersion = `9.9${'  9.9'.repeat(10_000)}!`;
    const repeatedOrRange = `9.9 ||${'  9.9 ||'.repeat(10_000)}!`;

    expect(appSupportsFdc3Version(app('repeated-version', repeatedVersion), '3.0')).toBe(false);
    expect(appSupportsFdc3Version(app('repeated-or-range', repeatedOrRange), '3.0')).toBe(false);
  });

  it('uses the version-range pattern defined by the App Directory schema', async () => {
    const schema = await import('../../../../packages/fdc3-standard/src/app-directory/specification/appd.schema.json', {
      with: { type: 'json' },
    });
    const schemaPattern = schema.default.components.schemas.BaseApplication.properties.fdc3Version.pattern;

    expect(FDC3_VERSION_RANGE_PATTERN.source).toBe(schemaPattern);
  });

  it('filters incompatible apps when the directory is populated', () => {
    const directory = new BasicDirectory(
      [app('unversioned'), app('current', '^3.0'), app('old', '<=2.2'), app('invalid', 'not-a-version')],
      '3.0'
    );

    expect(directory.retrieveAllApps().map(a => a.appId)).toEqual(['unversioned', 'current']);
  });

  it('filters added apps by version and ignores duplicate app IDs', () => {
    const directory = new BasicDirectory([app('existing')], '3.0');

    directory.addApps([
      app('existing', '^3.0'),
      app('compatible', '>=3.0'),
      app('incompatible', '<3.0'),
      app('invalid', '3.0.0'),
    ]);

    expect(directory.retrieveAllApps().map(a => a.appId)).toEqual(['existing', 'compatible']);
  });
});

describe('genericResultTypeSame', () => {
  it('matches unspecified, exact, and channel result types', () => {
    expect(genericResultTypeSame('ignored', undefined)).toBe(true);
    expect(genericResultTypeSame('string', 'string')).toBe(true);
    expect(genericResultTypeSame('channel<fdc3.instrument>', 'channel')).toBe(true);
  });

  it('rejects missing and different result types', () => {
    expect(genericResultTypeSame(undefined, 'string')).toBe(false);
    expect(genericResultTypeSame('number', 'string')).toBe(false);
  });
});
