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
}
```

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification and the name of the provider of the implementation.

#### See also
* [`DesktopAgent.getInfo`](DesktopAgent#getInfo)