
Feature: Remove an item from my inventory
  Remove an item from your inventory

  Scenario: I remove an item in an empty inventory
    Given there is nothing in my inventory
    When I remove an item
    Then nothing happens

  Scenario: I remove an item in a full inventory
    Given my inventory is full with a sword, a shield and a bow
    When I remove the shield
    Then the item is removed from the inventory



