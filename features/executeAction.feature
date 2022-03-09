Feature: Execute an action with a CQRS application
  Execute a command or a query with a CQRS application and use the appropriate handler.

  Scenario Outline: Execute a action with a CQRS application
    Given a CQRS app
    And command handlers are registered for command types A, B ,C
    And query handlers are registered for queries types D, E ,F
    When I execute a "<actionName>" "<actionType>"
    Then it should return the expected result: "<result>"

  Examples:
    | actionType  | actionName  | result        |
    | command     | CommandA    | A             |
    | command     | CommandB    | B             |
    | command     | CommandC    | C             |
    | command     | CommandD    | RangeError    |    
    | query       | QueryD      | D             |
    | query       | QueryE      | E             |
    | query       | QueryF      | F             |
    | query       | QueryG      | RangeError    |
