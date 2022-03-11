Feature: Execute a use case with a DYAL application
  Execute a command or a query with a DYAL application and use the appropriate use case handler.

  Scenario Outline: Execute a use case with a DYAL application
    Given a DYAL app
    And command handlers have been registered for command types A, B ,C
    And query handlers have been registered for queries types D, E ,F
    When I execute a "<useCaseName>" "<useCaseType>"
    Then it should return the expected result: "<result>"

  Examples:
    | useCaseType  | useCaseName  | result                                                                  |
    | command     | CommandA    | A                                                                         |
    | command     | CommandB    | B                                                                         |
    | command     | CommandC    | C                                                                         |
    | command     | CommandD    | RangeError: There is no command handler registered for this command name  |    
    | query       | QueryD      | D                                                                         |
    | query       | QueryE      | E                                                                         |
    | query       | QueryF      | F                                                                         |
    | query       | QueryG      | RangeError: There is no query handler registered for this query name      |

