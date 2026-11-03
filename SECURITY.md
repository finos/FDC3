# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.2     | :white_check_mark: |
| 2.0     | :white_check_mark: |
| < 1.2   | :x:                |

## Reporting a Vulnerability

If you uncover vulnerabilities in this software, please contact `help@finos.org` privately.  We aim to respond within 3 working days.

## FINOS Security Scanning

The FDC3 project is scanned using [GitHub Actions](https://github.com/finos/FDC3/actions) provided by the [FINOS Security Scanning](https://github.com/finos/security-scanning) project. If, as a maintainer, you can't access the results of these, please contact [FINOS Help](mailto:help@finos.org).

## Dependency Vulnerability Scanning

Known vulnerabilities in dependencies are checked by two workflows. Findings are grouped by area because they matter differently:

| Area | Covers | Policy |
| ---- | ------ | ------ |
| Library packages | `packages/*` and `toolbox/fdc3-for-web/fdc3-web-impl` (published to npm) | The nightly run **fails** on unsuppressed high/critical **runtime** vulnerabilities. Medium/low and dev-only findings are reported only. |
| Toolbox | The other `toolbox/*` workspaces and root dev tooling | Reported only |
| Website | `website/` (separate lockfile, not shipped to downstream apps) | Informational |
| GitHub Actions | `.github/workflows` | Reported only. Includes actions with known vulnerabilities (Dependabot does not alert on SHA-pinned actions) and workflow hardening issues. |

- **Nightly scan** (`.github/workflows/cve-scanning.yml`) runs `npm audit` for each area, Sonatype Guide (AuditJS) on runtime dependencies, and [zizmor](https://docs.zizmor.sh) on workflows. Runtime vs dev scope is worked out from the lockfile (`scripts/cve`). Each run writes a summary table by area, severity and fix availability to the run page, and keeps **one tracking issue per area** (labelled `cve-scan` and `cve-scan:<area>`) up to date. Issues are closed automatically when the area is clean. It can also be started manually from the Actions tab; outside `main` it only reports what it would do to issues.
- **Pull requests** (`.github/workflows/dependency-review.yml`) are blocked if they add a high/critical vulnerability in a runtime dependency.

### Accepting a risk

If a finding is a false positive or an accepted risk, add an entry to `allow-list.json`:

```json
{
  "ignore": [
    {
      "id": "CVE-2024-12345",
      "ghsa": "GHSA-xxxx-xxxx-xxxx",
      "reason": "Why this does not affect FDC3",
      "expires": "2027-01-31"
    }
  ]
}
```

`id` (a CVE, GHSA or Sonatype ID) and `reason` are required. `ghsa` and `expires` (`YYYY-MM-DD`) are optional; `ghsa` should be added when `id` is a CVE so pull request checks can match it. Entries stop applying after their `expires` date, so accepted risks get reviewed again. Validate the file with `node scripts/cve/allowlist.mjs --check`.

Dependabot [malware alerts](https://docs.github.com/en/code-security/dependabot) are a repository setting rather than a workflow option. Maintainers with admin access should enable them in the repository's code security settings.

Tests for the scanning scripts run with `npm run test:cve`.
