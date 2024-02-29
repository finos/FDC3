# Browser Communication Protocol (BCP)

BCP constitutes a set of messages that are used by the `@finos/fdc3` library to communicate with Browser-Resident DAs. Each message takes the form of a Flux Standard Action (FSA). Communications are bidirectional and occur over HTML standard MessagePorts. All messages are query/response. Responses may contain requested data or may simply be acknowledgement of receipt.

TODO