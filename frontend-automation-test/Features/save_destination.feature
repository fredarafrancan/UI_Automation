@save-destination
Feature: Save a destination freda

  Scenario Outline: User saves multiple destinations from the Explore page
    Given the user is on the Explore page
    When the user saves the first <destination_count> destinations
    Then the first <destination_count> destinations are saved and displayed on the Saved page

    Examples:
      | destination_count |
      | 3                 |
      | 4                 |
      | 5                 |