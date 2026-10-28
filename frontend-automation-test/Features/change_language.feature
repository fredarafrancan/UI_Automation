@smoke-test
Feature: Change preferred language

  @change-language
  Scenario: User changes the preferred language from the profile page
    Given user is on home page
    When user clicks on profile page
    Then user chooses the preferred language
    And the language changes according to user preference

  @language-persistence
  Scenario: Preferred language remains selected after closing and reopening the website
    Given user is on home page
    When user clicks on profile page
    Then user chooses the preferred language
    And the language changes according to user preference
    When user closes the website
    Then the preferred language is saved