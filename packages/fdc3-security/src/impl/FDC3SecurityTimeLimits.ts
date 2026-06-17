/**
 * Time limit configuration for FDC3 Security operations.
 *
 * Separates signature freshness from context validity to allow
 * independent control over each.
 */
export interface FDC3SecurityTimeLimits {
  /**
   * Maximum age of a signature in seconds.
   *
   * A signature older than this (based on `iat` in the JWS header)
   * will be rejected. This protects against replay attacks by ensuring
   * signatures are recent.
   *
   * @default 300 (5 minutes)
   */
  signatureFreshnessSeconds: number;

  /**
   * Default validity period for signed contexts in seconds.
   *
   * Used to compute `exp` when a context doesn't have explicit
   * `antiReplay` claims. The context will be considered expired
   * after `iat + contextValiditySeconds`.
   *
   * @default 300 (5 minutes)
   */
  contextValiditySeconds: number;
}

/**
 * Default time limits for FDC3 Security.
 *
 * Both signature freshness and context validity default to 5 minutes.
 */
export const DEFAULT_FDC3_TIME_LIMITS: FDC3SecurityTimeLimits = {
  signatureFreshnessSeconds: 5 * 60,
  contextValiditySeconds: 5 * 60,
};
