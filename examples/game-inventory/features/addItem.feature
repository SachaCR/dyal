
Feature: Add an item to my inventory
  Add an item to your inventory

  Scenario: I add an item in an empty inventory
    Given there is nothing in my inventory
    When I try to add a sword
    Then the sword is added to the inventory

  Scenario: I add an item in a full inventory
    Given my inventory is full with a sword, a shield and a bow
    When I try to add a spear
    Then the spear is not added to the inventory



