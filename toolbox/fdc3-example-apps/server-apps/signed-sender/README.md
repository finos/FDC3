# Signed broadcast sender

The backend signs `fdc3.instrument` (for example via `BasicSignedBroadcaster`) and the client broadcasts signed envelopes on the user channel. Pair it with the signed receiver to demonstrate JWKS-backed verification of user-channel context.
