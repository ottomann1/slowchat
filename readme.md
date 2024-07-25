## Final weekend assignment 😱 💀

You will build a full-stack slow-messaging app.

## Notes on the final assignment

The submission should represent the best you can do in this given timespan. The requirements are things that you should make extra sure to include, and failing to fulfill them will most likely lead to the submission being marked as a fail.

Failed submissions will have one extra attempt during an upcoming weekend.

Developers need to be mentally prepared for the test to take more than 8h per day Friday-Sunday.
Deadline for this one is extended until 08:00 on Monday.

No code is provided in the final assignment.

## Background

You will build a group messaging app where the goal is to get the users to use the app as little as possible.

The user can fetch all messages once a day, with two extra fetches that refills every Sunday.

A message posted to the server will be on cooldown for one hour before they are allowed to be fetched.

Messages on cooldown should be included in the fetched messages, but only with metadata like the author and timestamp of the message, but not the actual content.


### Example
```
Gareth sends the message "Hi everyone!" at 13:15 on Monday.
Farah sends the message "Amazing app :-)" at 14:00 on Monday.

Gareth has all his 3 fetch tokens left.
Gareth clicks the button [Fetch Messages] to fetch new messages at 14:15 on Monday. He will now have 2 fetch tokens left.
Gareth gets to see his own message "Hi everyone!", and sees that a message from Farah is on cooldown until 15:00.
At 14:30 Gareth fetches again. He now has one fetch token left. He sees that there's no new messages.
At 15:00 Gareth fetches again. He is now out of tokens. He can now see both his and Farah's message.
On Tuesday at 00:00 UTC time, Gareth gets one new daily fetch token. He now has one fetch token.
On Sunday at 00:00 UTC time, Gareth gets two new weekly fetch tokens. He now has three fetch tokens.
Next Sunday at 00:00 UTC time, Gareth already has all daily and weekly tokens, so he stays at three fetch tokens.
```

## Requirements

- Tech stack: Next.js, Drizzle, Postgres, Zod, ESLint, TypeScript.
- A readme explaining your big-picture plan, challenges you encountered, choices made, and highlights in your solution.
- GitHub planning board.
- You should have big picture goals as your sprint goals; and at a minimum of 4 sprint goals should be done so it's simple to understand how you divided your work into large chunks.
- Good UI design, including good choice of font, color, layout, and component design.
- Responsive design that works well on both mobile and on laptop.
- Semantic HTML.
- Tidy code.
- Good file structure.
- All business logic should be tested with automated tests.
- Tests should have clear names that explain how your code behaves.
- Added `"lint"` and `"test"` scripts in package.json.
- Clean commits.
- The user should be able to login with any chosen username and a shared password.
- The password should be the same for all users and set using an environment variable that the server can read from.
- There should be a page showing statistics for all users.
- The statistics page should show how many messages that a user has written in total, number of written messages per message-fetch, and number of received new messages per message-fetch that were not on cooldown.
- The statistics page does not _require_ graphs, just numbers.
- The design of the statistics page can be very plain, and only needs to work on a laptop.

## Tips and general comments

- If you think about what information you store in the database, and what information you calculate based on the stored data, you can have a simpler time. Storing the wrong information might lead to you getting stuck and needing to start over. Pay extra attention to the data related to cooldown and the message-fetch data.
- The assignment might feel dreadingly hard, or surprisingly simple. Either way, plan on getting the "walking skeleton" in place as soon as possible. A walking skeleton has no UI design, and no real business logic. It just connects all the layers of the app together and makes the right function calls. You can come a long way with mock data and then use unit tests to make sure your business logic covers all the edge cases.
- Break out the business logic to pure functions that take simple Date objects, numbers, string, etc, as arguments. If you try to test the business logic by getting the real current time, then it would take two weeks to test the example scenario.