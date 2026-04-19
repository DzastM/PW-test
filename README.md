# PW-test

This project contains Playwright tests.

## Test topic

The test topic is to verify the challenges page:

https://www.cnarios.com/challenges

## First-time setup

### Required tools

- Node.js (recommended: current LTS version)
- npm (included with Node.js)

You can verify installation with:

```powershell
node -v
npm -v
```

### Install project dependencies

From the project root, run:

```powershell
npm install
```

### Install Playwright browsers

For first-time Playwright usage on a machine, run:

```powershell
npx playwright install
```

### Run tests

Run all tests:

```powershell
npx playwright test
```

Run tests in headed mode:

```powershell
npx playwright test --headed
```

Open the HTML report after a run:

```powershell
npx playwright show-report
```
