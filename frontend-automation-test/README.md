# Frontend automation test

This Cucumber scenario uses Playwright to change the language on the Samosirgo profile page.

```powershell
npm.cmd install
npx.cmd playwright install chromium
npm.cmd test
```

Run these commands from the `frontend-automation-test` folder. The `.cmd` shims avoid PowerShell's script execution policy; no policy change is needed. Use `npm.cmd test` for the Gherkin feature instead of `npx playwright test`, which expects Playwright Test files rather than `.feature` files.

The preferred language defaults to English. Set `PREFERRED_LANGUAGE` to `Indonesia` or `English` to choose another option. Set `BASE_URL` to run against a different deployment. Headed mode uses the installed Microsoft Edge browser by default; set `BROWSER_CHANNEL` to `chrome` or `chromium` to select another Playwright browser channel.