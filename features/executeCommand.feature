Feature: Execute a command with a CQRS application
  Execute a command with a CQRS application and use the appropriate handler.

  Scenario Outline: Execute a command with a CQRS application
    Given a CQRS app 
    And command handlers are registered for command types A, B ,C
    When I execute a "<actionName>" "<actionType>"
    Then it should return the expected result: "<result>"

  Examples:
    | actionType  | actionName  | result        |
    | command     | CommandA    | A             |
    | command     | CommandB    | B             |
    | command     | CommandC    | C             |
    | command     | CommandD    | RangeError    |    

    