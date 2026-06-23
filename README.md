# Bug Project Watcher

A tiny Node.js app with intentionally simple business logic bugs. This repo exists to dogfood [`PostHog/posthog-watcher-action`](https://github.com/PostHog/posthog-watcher-action) by opening GitHub issues against known broken behavior and letting the action triage or fix them.

## Run locally

```bash
npm test
npm start
```

The app uses only built-in Node.js modules, so `npm install` is not required.

## API

Start the server with `npm start`, then try:

```bash
curl 'http://localhost:3000/health'
curl 'http://localhost:3000/discount?price=250&percent=10'
curl -X POST 'http://localhost:3000/cart/total' \
  -H 'content-type: application/json' \
  -d '{"items":[{"price":3,"quantity":4},{"price":2.5,"quantity":2}]}'
curl -X POST 'http://localhost:3000/users/normalize' \
  -H 'content-type: application/json' \
  -d '{"username":"  Ada   Lovelace  "}'
```

## Dogfood issue ideas

Open one issue per bug so the watcher action has a small, focused task:

1. Discount calculation treats the percent as a flat amount.
2. Cart total ignores item quantities.
3. Username normalization only replaces the first space and leaves repeated whitespace.
4. Shipping estimates round down instead of preserving cents.
5. Email validation accepts addresses without a domain suffix.

The tests describe the expected behavior and currently fail by design.
