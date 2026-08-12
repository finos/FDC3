declare module 'semver' {
  export interface Options {
    includePrerelease?: boolean;
    loose?: boolean;
  }

  export interface SemVer {
    version: string;
  }

  export function coerce(version: string, options?: Options): SemVer | null;
  export function validRange(range: string, optionsOrLoose?: boolean | Options): string | null;
  export function satisfies(version: string, range: string, optionsOrLoose?: boolean | Options): boolean;

  const semver: {
    coerce: typeof coerce;
    validRange: typeof validRange;
    satisfies: typeof satisfies;
  };

  export default semver;
}
