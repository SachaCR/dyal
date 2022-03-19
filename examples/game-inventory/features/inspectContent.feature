
Feature: Inspect Inventory Content
  Inspect what your character inventory contains

  Scenario: I inspect empty inventory content
    Given there is nothing in my inventory
    When I inspect its content
    Then it returns an empty item list

  Scenario Outline: I inspect my inventory content at its full capacity
    Given my inventory is full with a sword, a shield and a bow
    When I inspect its content
    Then it returns an item list that contains a sword, a shield and a bow

  Scenario: I inspect my inventory content
    Given there is a sword in my inventory
    When I inspect its content
    Then it returns an item list that contains a sword


