Feature: Utility functions

	Scenario: throwIfUndefined is used to check properties
		When I call throwIfUndefined it throws if a specified property is not defined
		And I call throwIfUndefined it does NOT throw if a specified property IS defined
		
	Scenario: Logger utility
		When All log functions are used with a message
		When All log functions are used with an error
		