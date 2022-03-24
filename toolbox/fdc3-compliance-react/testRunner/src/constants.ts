/**
 * Constants used in compliance testing
 */
const constants = {
  Fdc3Timeout: 5000, // The amount of time to wait for the FDC3Ready event during initialisation
  TestTimeout: 10000, // Tests that take longer than this (in milliseconds) will fail
} as const;

export default constants;
