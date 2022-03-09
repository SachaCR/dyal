Feature: Middleware stack
  Goes through all middlewares in the stack for a given action execution

  Scenario: Uses all middlewares in the stack on a given action
    Given a CQRS app with a test context
    And 3 middlewares that returns they have been called in the result
    When I execute an action
    Then the result indicates all middlewares have been called in order and then backwards
