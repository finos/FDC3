import { describe, expect, it } from 'vitest';
import { BasicDirectory, appSupportsFdc3Version } from '../src/directory/BasicDirectory.js';
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
    expect(appSupportsFdc3Version(app('minimum', '>=2.2'), '3.0')).toBe(true);
  });

  it('excludes apps with incompatible or invalid FDC3 version metadata', () => {
    expect(appSupportsFdc3Version(app('maximum', '<=2.2'), '3.0')).toBe(false);
    expect(appSupportsFdc3Version(app('invalid', 'not-a-version'), '2.2')).toBe(false);
  });

  it('filters incompatible apps when the directory is populated', () => {
    const directory = new BasicDirectory(
      [app('unversioned'), app('current', '^2.2'), app('old', '<=2.2'), app('invalid', 'not-a-version')],
      '3.0'
    );

    expect(directory.retrieveAllApps().map(a => a.appId)).toEqual(['unversioned', 'current']);
  });
});
