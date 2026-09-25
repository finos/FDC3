/**
 * Compatibility barrel re-exporting both ./BridgingTypesCore.js (types + fast `is<X>` predicates) and
 * ./BridgingTypesValidation.js (the `Convert` class + `isValid<X>` predicates), so existing code doing
 * `import { BridgingTypes } from '@finos/fdc3-schema'; BridgingTypes.isValidX(...)` keeps working unchanged.
 * Internal consumers import ./BridgingTypesCore.js directly instead of this barrel, so their bundles never
 * reach the validation runtime. See https://github.com/finos/FDC3/issues/1901.
 */
export * from './BridgingTypesCore.js';
export * from './BridgingTypesValidation.js';
