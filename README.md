# ShopLite: the AI QA Lab test-automation challenge

A tiny web shop with **14 requirements and 6 hidden bugs**. Give it to your AI and see
how many it finds.

📺 Watch the experiment: https://www.youtube.com/watch?v=WjPOU_I5UyA

## Run the app
```
npx serve app -l 8080          # or: python3 -m http.server 8080 --directory app
```
Open http://localhost:8080 and log in with `demo@shoplite.test` / `Passw0rd!`

## The challenge
1. Give your AI **only** `REQUIREMENTS.md` and access to the running app.
   Don't let it read `app/index.html` (the bugs are in the JavaScript).
2. Ask it to build a Playwright test suite from scratch and tell you which failures are real bugs.
3. Max 3 fix rounds. You don't write any code.
4. Score it against the bug key, then post your score (and which AI) in the YouTube comments.

## Spoilers
`SPOILERS-bug-key/` has the 6 bugs and a script that proves each one reproduces.
Don't open it until you've scored your AI.

MIT licensed. Made for the AI QA Lab YouTube channel.
