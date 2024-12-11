Feature: Utility functions

Scenario: Logger utility
	When All log functions are used with a message
	Then All log functions are used without a message

Scenario: UUID generator
	When A uuid is generated
