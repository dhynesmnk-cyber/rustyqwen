# Project overview

## Core objective

The objective of this build is to create a custom headless e-commerce frontend for Rusty's Sandwich Parlour, a local sandwich shop that wants a simple online ordering experience without the cost and operational overhead of a conventional online payment checkout.

The website will allow customers to browse the menu, customise sandwich orders, and submit an order for collection. However, it will deliberately bypass standard online checkout systems and payment capture. Customers will order online and pay at the venue when they collect their food.

This unpaid order model reduces online gateway fees, avoids the need to handle card details on the website, and simplifies kitchen operations by sending orders directly into the venue's existing Square POS workflow.

## Operating model

The core workflow is a "Pay in Store" model:

1. The customer browses menu items sourced from the Square Catalog API.
2. The customer selects item options, modifiers, and quantities.
3. The customer adds items to the cart.
4. The customer provides their name, phone number, and preferred pickup time.
5. The customer confirms that they understand payment is required at the venue.
6. A server-side function submits the order to Square using the Orders API.
7. The order is created in Square's default `OPEN` state.
8. The order appears in the venue's Square POS as an open ticket.
9. Staff fulfil the order and take payment in-store through Square POS.

The website does not take payment, store card details, or create a completed online transaction. It creates an open order that staff can settle at the venue.

## Technology stack

The recommended technology stack is:

- **Frontend:** A modern JavaScript framework hosted on Netlify. The examples in this documentation assume a Next.js-style frontend, but the architecture is also suitable for other modern frameworks supported by Netlify.
- **Hosting:** Netlify, using static rendering, server-side rendering, or static generation as appropriate.
- **Server-side layer:** Netlify Functions, framework API routes, or another serverless function layer deployed alongside the frontend.
- **Backend commerce system:** Square APIs only.
- **Square APIs in scope:**
  - Catalog API, for menu items, item variations, modifiers, and taxes.
  - Orders API, for creating open pickup orders.
- **Square APIs explicitly out of scope:**
  - Payments API.
  - Web Payments SDK.
  - Online card payment flows.

The frontend is responsible for presenting the menu, managing the cart, collecting customer contact details, and collecting a pickup time. The server-side layer is responsible for securely communicating with Square.

## Why Square API calls must be server-side

Square APIs should not be called directly from the browser.

The Square access token is a secret credential. If it were included in browser-side code, it could be discovered and misused. Square API calls must therefore be made from a server-side layer such as a Netlify Function.

The recommended request flow is:

1. The browser sends a request to a serverless function, for example `POST /api/create-order`.
2. The function validates the incoming request.
3. The function uses the private `SQUARE_ACCESS_TOKEN` environment variable.
4. The function calls the Square API.
5. The function returns only the necessary result to the browser.

This approach keeps credentials private, centralises error handling, allows rate-limit protection, and reduces the risk of exposing Square configuration to the public internet.
