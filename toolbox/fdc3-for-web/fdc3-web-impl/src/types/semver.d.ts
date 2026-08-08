declare module 'semver' {
  export interface Options {
    includePrerelease?: boolean;
    loose?: boolean;
  }

  export function validRange(range: string, optionsOrLoose?: boolean | Options): string | null;
  export function satisfies(version: string, range: string, optionsOrLoose?: boolean | Options): boolean;

  const semver: {
    validRange: typeof validRange;
    satisfies: typeof satisfies;
  };

  export default semver;
}
