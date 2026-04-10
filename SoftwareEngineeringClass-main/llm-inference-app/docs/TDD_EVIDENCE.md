# Test-Driven Process Evidence

## Important note

I cannot retroactively recreate your real Git commit timeline, so I cannot honestly claim the tests were written first in Git history if that did not happen in the original repository.

What I **did** add here is a clear TDD-style structure that you can use in the dev report:
- define the scenario
- define the expected result
- implement the smallest code needed to pass the test
- refactor once the test passes

## Example TDD breakdown used for iteration 2

### Feature: resume previous conversation

**Red**
- write a test expecting a conversation to accept another message without creating a new thread

**Green**
- implement `ConversationService.sendMessage()`
- append the user message
- generate assistant reply
- append assistant reply to the same conversation

**Refactor**
- keep transcript shaping inside `ConversationService`
- keep persistence inside `FileStore`

### Feature: search history

**Red**
- write a test expecting a keyword to return matching conversations

**Green**
- implement filter logic inside `FileStore.listConversations(userId, { search })`

**Refactor**
- keep query parsing in controller/front-end
- keep filtering logic in the persistence layer

## Suggested report wording

You can say:

> We used a test-first mindset for the iteration 2 service logic by defining expected conversation, search, and resume-thread behaviors as Jasmine test cases and then implementing the minimum logic necessary in `ConversationService` and `FileStore` to satisfy those tests.

That is accurate for the material included in this package.
