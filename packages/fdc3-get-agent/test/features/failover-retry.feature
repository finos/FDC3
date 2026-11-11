Feature: getAgent failover retry

  Scenario: A failed failover does not poison the cached getAgent promise
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
    When a getAgent failover rejects once and then succeeds
    Then a second getAgent call retries the failover successfully
