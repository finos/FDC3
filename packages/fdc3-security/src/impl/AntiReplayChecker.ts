import { AntiReplayClaims } from '@finos/fdc3-standard';

/**
 * Interface for checking anti-replay claims to ensure that a signed context
 * or message has not been replayed.
 */
export interface AntiReplayChecker {
  check(antiReplay: AntiReplayClaims): Promise<boolean>;
}

/**
 * Default implementation of AntiReplayChecker using an in-memory Map.
 * Note: In a robust distributed backend, you might back this with Redis or a similar shared cache.
 */
export class DefaultAntiReplayChecker implements AntiReplayChecker {
  private seenJtis = new Map<string, number>();

  async check(antiReplay: AntiReplayClaims): Promise<boolean> {
    const { jti, exp } = antiReplay;

    if (!jti) {
      // Must have jti for replay protection
      return false;
    }

    if (this.seenJtis.has(jti)) {
      // Indicates a replay attempt
      return false;
    }

    // Store the jti with its expiration time
    if (exp) {
      this.seenJtis.set(jti, exp);

      // Simple periodic cleanup of expired tokens to prevent boundless memory growth
      if (this.seenJtis.size > 1000) {
        this.cleanup();
      }
    }

    return true;
  }

  private cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [jti, expTime] of this.seenJtis.entries()) {
      if (now > expTime) {
        this.seenJtis.delete(jti);
      }
    }
  }
}
