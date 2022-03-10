Feature: Middleware stack
  Goes through all middlewares in the stack for a given use case execution

  Scenario: Uses all middlewares in the stack on a given use case
    Given a DYAL app with a test context
    And 3 middlewares that returns they have been called in the result
    When I execute a use case
    Then the result indicates all middlewares have been called in order and then backwards
