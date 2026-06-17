# Login POC

Client application that raises the `GetUser` intent against an identity provider app (demo IDP or Entra), decrypts the returned `fdc3.security.encryptedContext` on the trusted backend, and caches the resulting `fdc3.security.user` session.

Run with **Identity Provider App (Demo)** or **Microsoft Entra Identity Provider App** from the example app directory.
