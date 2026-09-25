/**
 * Compatibility barrel re-exporting both ./BrowserTypesCore.js (types + fast `is<X>` predicates) and
 * ./BrowserTypesValidation.js (the `Convert` class + `isValid<X>` predicates), so existing code doing
 * `import { BrowserTypes } from '@finos/fdc3-schema'; BrowserTypes.isValidX(...)` keeps working unchanged.
 * Internal consumers import ./BrowserTypesCore.js directly instead of this barrel, so their bundles never
 * reach the validation runtime. See https://github.com/finos/FDC3/issues/1901.
 */
export * from './BrowserTypesCore.js';
export * from './BrowserTypesValidation.js';
