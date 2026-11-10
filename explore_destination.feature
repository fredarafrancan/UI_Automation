Given the user is on the Explore page
When the destination list is displayed
Then the destinations are shown as cards
And at least one destination card is visible
And no error message is displayed
And every card shows the destination name
And every card shows the category
And every card shows the district

Given a destination has an image
When the user looks at the card of that destination
Then the card shows the image
And the image is not broken or stretched
And the card still shows the name, category, and district

Given a destination does not have an image
When the user looks at the card of that destination
Then the card shows a placeholder instead of an image
And no broken image icon is displayed
And the card layout is the same as the other cards
And the card still shows the name, category, and district

Given the user sees the list of destination cards
When the user clicks the first destination card
Then the detail page of that destination opens
And the detail page shows the same destination name as the card