# Frontend automation tests

These Cucumber scenarios use Playwright to test the Samosirgo language settings,
saved destinations, and Explore destination cards. The Explore feature checks
card information, image and placeholder rendering, and opening a destination's
detail page.

```powershell
npm.cmd install
npx.cmd playwright install chromium
npm.cmd test
```

Run these commands from the `frontend-automation-test` folder. The `.cmd` shims avoid PowerShell's script execution policy; no policy change is needed. Use `npm.cmd test` for the Gherkin feature instead of `npx playwright test`, which expects Playwright Test files rather than `.feature` files.

The preferred language defaults to English. Set `PREFERRED_LANGUAGE` to `Indonesia` or `English` to choose another option. Set `BASE_URL` to run against a different deployment. Headed mode uses the installed Microsoft Edge browser by default; set `BROWSER_CHANNEL` to `chrome` or `chromium` to select another Playwright browser channel.

The no-image Explore scenario requires at least one destination without an image
in the selected deployment. It fails with an explicit message if the current
destination list contains no such card. Run the other Explore scenarios without
that data requirement using
`npx.cmd cucumber-js Features/explore_destination.feature --require "Steps/**/*.js" --tags "not @requires-image-free-destination"`.