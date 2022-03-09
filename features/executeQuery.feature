Feature: Execute a query with a CQRS application
  Execute a query with a CQRS application and use the appropriate handler.

  Scenario Outline: Execute a query with a CQRS application
    Given a CQRS app 
    And query handlers are registered for queries types D, E ,F
    When I execute a "<actionName>" "<actionType>"
    Then it should return the expected result: "<result>"

  Examples:
    | actionType  | actionName  | result        |
    | query       | QueryD      | D             |
    | query       | QueryE      | E             |
    | query       | QueryF      | F             |
    | query       | QueryG      | RangeError    |