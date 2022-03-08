Feature: Execute a command?
  Executing a command with an app

  Scenario Outline: Execute a command
    Given a CQRS app 
    And command handlers are regitered for command types A, B ,C
    When I execute a "<commandType>" command
    Then it should return "<result>"

  Examples:
    | commandType | result        |
    | CommandA    | A             |
    | CommandB    | B             |
    | CommandC    | C             |
    | CommandD    | RangeError    |

