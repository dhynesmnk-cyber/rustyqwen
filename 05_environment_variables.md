# Environment variables

## Overview

The project requires Square configuration variables for local development and Netlify deployment. Sensitive values, especially the Square access token, must only be available to the server-side layer.

Secrets must never be exposed to the browser, committed to source control, or included in client-side JavaScript bundles.

## Required variables

| Variable | Required | Example | Purpose |
|---|---:|---|---|
| `SQUARE_ACCESS_TOKEN` | Yes | `EAAA...` | Secret Square API credential used by server-side functions. |
| `SQUARE_ENVIRONMENT` | Yes | `sandbox` | Selects the Square environment. Use `sandbox` during initial development. |
| `SQUARE_LOCATION_ID` | Yes | `ABC123XYZ` | Square location where open pickup orders are created. |

## Optional variables

| Variable | Required | Example | Purpose |
|---|---:|---|---|
| `SQUARE_APPLICATION_ID` | No | `sq0idp-...` | Not required for the current scope. Only needed if the project later uses OAuth flows or the Web Payments SDK. |
| `SITE_URL` | No | `http://localhost:8888` | Local or deployed site URL for redirects and absolute links. |
| `TIMEZONE` | No | `Australia/Melbourne` | Timezone used for pickup time validation and display. |
| `SQUARE_CATALOG_CACHE_TTL_SECONDS` | No | `300` | Cache duration for Catalog API responses. |
| `ORDER_MIN_LEAD_MINUTES` | No | `15` | Minimum time between order placement and pickup. |
| `ORDER_MAX_DAYS_AHEAD` | No | `7` | Maximum number of days ahead a customer may book pickup. |

## Square environment note

During initial development, `SQUARE_ENVIRONMENT` should be set to:

```env
SQUARE_ENVIRONMENT=sandbox
```

Use the sandbox environment while building and testing against Square's APIs. Only change this to `production` after the sandbox flow has been validated and the venue is ready to receive live open orders.

The Square API base URL should be selected based on this variable:

- Sandbox: `https://connect.squareupsandbox.com`
- Production: `https://connect.squareup.com`

## Square application ID note

`SQUARE_APPLICATION_ID` is not required for the current build.

The current scope uses server-side Catalog and Orders API calls only. It does not use OAuth user authorisation, the Web Payments SDK, or browser-based payment flows.

If those features are added later, `SQUARE_APPLICATION_ID` may become necessary.

## `.env.example`

```env
# Square API configuration
# Keep SQUARE_ACCESS_TOKEN secret. Do not expose it to the browser.
SQUARE_ACCESS_TOKEN=EAAA_REPLACE_WITH_SANDBOX_ACCESS_TOKEN

# Use sandbox during initial development.
# Use production only after testing is complete.
SQUARE_ENVIRONMENT=sandbox

# Square location where orders will be created.
SQUARE_LOCATION_ID=REPLACE_WITH_LOCATION_ID

# Optional application configuration
SITE_URL=http://localhost:8888
TIMEZONE=Australia/Melbourne
SQUARE_CATALOG_CACHE_TTL_SECONDS=300
ORDER_MIN_LEAD_MINUTES=15
ORDER_MAX_DAYS_AHEAD=7

# Not required for the current scope.
# SQUARE_APPLICATION_ID=
```

## Local development guidance

- Copy `.env.example` to `.env` for local development.
- Do not commit `.env` to source control.
- Use sandbox credentials locally.
- Use `netlify dev` or the equivalent framework development command if local serverless functions are required.
- Do not prefix secret variables with public client-side prefixes such as `NEXT_PUBLIC_`, `VITE_`, or `PUBLIC_`.

## Netlify deployment guidance

In Netlify, add environment variables in the project's environment variable settings.

Required Netlify environment variables:

```env
SQUARE_ACCESS_TOKEN
SQUARE_ENVIRONMENT
SQUARE_LOCATION_ID
```

Notes:

- `SQUARE_ACCESS_TOKEN` must be treated as a secret.
- `SQUARE_ENVIRONMENT` should be `sandbox` in preview or development deployments until production readiness is confirmed.
- `SQUARE_LOCATION_ID` should point to the correct Square location for Rusty's Sandwich Parlour.
- Secrets should never be exposed to the browser, printed into client logs, or returned to the frontend in API responses.
