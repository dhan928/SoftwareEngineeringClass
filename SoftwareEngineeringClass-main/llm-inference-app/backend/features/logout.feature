Feature: Logout
  As a logged-in user
  I want to log out of the application
  So that my session is cleared and I return to the home page

  Scenario: Logging out from the dashboard
    Given I am on the Login page
    When I enter a valid email and password
    And I click the Login button
    Then I should be redirected to my dashboard
    When I click the Logout button
    Then I should be redirected to the home page

