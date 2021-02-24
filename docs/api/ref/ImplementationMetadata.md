---
id: ImplementationMetadata
sidebar_label: ImplementationMetadata
title: ImplementationMetadata
hide_title: true
---
# `ImplementationMetadata`

```typescript
public interface ImplementationMetadata {
  fdc3Version: string;
  provider: string;
  providerVersion?: string;
  compareVersion(version: string): number;
  versionIsAtLeast(version: string): boolean;
}
```

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification

#### See also
* [`DesktopAgent.getInfo`](DesktopAgent#getInfo)