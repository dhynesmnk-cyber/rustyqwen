# Square API architecture

## Integration strategy

The application will use Square as the source of truth for menu data and order creation. The build follows a "Pay in Store" flow: the website creates an open order in Square, and the venue completes payment through Square POS when the customer arrives.

Only the following Square APIs are in scope:

- **Catalog API**, for retrieving menu items, item variations, modifiers, and taxes.
- **Orders API**, for creating open pickup orders.

The following are explicitly out of scope:

- Payments API.
- Web Payments SDK.
- Online card tokenisation.
- Online payment authorisation.
- Refund API workflows.
- Subscription or invoicing workflows.

All Square API calls must be made from the server-side layer, such as Netlify Functions. The browser must never receive or use `SQUARE_ACCESS_TOKEN`.

## Catalog API

The Catalog API is used to build the customer-facing menu.

The application should retrieve the following Catalog object types:

- `ITEM`
- `ITEM_VARIATION`
- `MODIFIER_LIST`
- `MODIFIER`
- `TAX`
- Optionally, `CATEGORY` if menu grouping is required.

A suitable Catalog retrieval endpoint is:

```http
GET /v2/catalog/list?types=ITEM,ITEM_VARIATION,MODIFIER_LIST,MODIFIER,TAX
```

Alternatively, the application may use `SearchCatalogObjects` if more structured filtering is required.

### Catalog data mapping

The frontend should map Catalog data into a menu model:

- Square `ITEM` objects become menu item pages.
- Square `ITEM_VARIATION` objects represent purchasable versions of an item.
- Square `MODIFIER_LIST` objects represent option groups, such as bread choice or extras.
- Square `MODIFIER` objects represent individual choices within a modifier list.
- Square `TAX` objects are used to calculate taxes when creating the order.

### Catalog behaviour

- Menu items should be generated dynamically from the Square Catalog.
- If an item is unavailable, hidden, or not valid for the selected location, it should not be displayed.
- Prices should be displayed using Square's money format.
- Modifier requirements should be respected. Required modifier lists must be completed before an item can be added to the cart.
- The server should cache Catalog data where practical to reduce API usage and improve performance.

Catalog caching is recommended because menu data changes less frequently than orders are created.

## Orders API

The Orders API is used to create an open pickup order in Square.

The application will call:

```http
POST /v2/orders
```

The request must be made from a server-side function and must include:

- The Square location ID.
- An idempotency key.
- Order line items based on Catalog object IDs.
- Selected modifiers.
- Applicable taxes.
- A fulfilment object with type `PICKUP`.
- Pickup details containing the customer's name, phone number, and pickup time.

### CreateOrder payload requirements

The `CreateOrder` payload must include a `fulfillments` array. Each fulfilment used for this project must have:

- `type`: `PICKUP`
- `pickup_details.recipient.display_name`: the customer's name
- `pickup_details.recipient.phone_number`: the customer's phone number
- `pickup_details.pickup_at`: the selected pickup timestamp

### Example CreateOrder request body

```json
{
  "idempotency_key": "REPLACE_WITH_UUID",
  "order": {
    "location_id": "REPLACE_WITH_SQUARE_LOCATION_ID",
    "source": {
      "name": "Rusty's Sandwich Parlour Website"
    },
    "line_items": [
      {
        "uid": "line_item_1",
        "quantity": "1",
        "catalog_object_id": "REPLACE_WITH_ITEM_VARIATION_ID",
        "modifiers": [
          {
            "catalog_object_id": "REPLACE_WITH_MODIFIER_ID"
          }
        ],
        "applied_taxes": [
          {
            "tax_uid": "order_tax_1"
          }
        ]
      }
    ],
    "taxes": [
      {
        "uid": "order_tax_1",
        "catalog_object_id": "REPLACE_WITH_TAX_ID",
        "scope": "ORDER"
      }
    ],
    "fulfillments": [
      {
        "type": "PICKUP",
        "state": "PROPOSED",
        "pickup_details": {
          "recipient": {
            "display_name": "Alex Lee",
            "phone_number": "+61400123456"
          },
          "pickup_at": "2026-08-17T12:30:00+10:00",
          "note": "Customer will pay at the counter."
        }
      }
    ]
  }
}
```

### Payload notes

- The `idempotency_key` should be generated server-side for each order submission attempt.
- The `location_id` must match the Square location where the order will be fulfilled.
- Line items should reference valid Catalog object IDs.
- The server should validate the cart before submitting it to Square.
- The server should not trust client-side totals. Square's response should be treated as the authoritative order total.
- The pickup timestamp should be a valid ISO 8601 timestamp with the appropriate Australian timezone offset.

## Order state

Orders created by this application should remain in Square's default `OPEN` state.

The application must not:

- Add a payment to the order.
- Call the Payments API.
- Mark the order as completed after submission.
- Attempt to settle the order online.

The order should appear in Square POS as an open ticket. Staff can then:

- Accept payment by card, cash, or another venue-supported method.
- Apply venue-level adjustments if required.
- Complete the order in Square POS.
- Cancel or modify the order according to the venue's operational process.

This is the key mechanism for avoiding online gateway fees while still using Square as the operational ordering system.

## Payments API

The Payments API is not used in this build.

The Web Payments SDK is also not used.

The website must not:

- Display credit card input fields.
- Collect card numbers, expiry dates, CVV values, or cardholder billing addresses for payment purposes.
- Tokenise card details.
- Authorise or capture payment.
- Store payment credentials.

The customer is informed clearly during checkout that payment is required at the venue.

## Error handling

Error handling should be defensive, user-friendly, and operationally safe.

### Common API error cases

The server-side layer should handle:

- `400` invalid request errors.
- `401` authentication errors.
- `403` permission errors.
- `404` missing Catalog object or location errors.
- `409` conflict errors.
- `429` rate-limit errors.
- `5xx` Square service errors.

### Rate limits

To minimise rate-limit issues:

- Cache Catalog API responses where practical.
- Avoid calling the Catalog API on every user interaction.
- Use stale-while-revalidate behaviour if appropriate.
- Retry only safe, idempotent read requests automatically.
- For order creation, retry cautiously and only with the same idempotency key where safe.
- Use exponential backoff with jitter for retryable failures.

### Unavailable Square services

If Square is unavailable:

- The frontend should show a clear, calm message.
- Checkout should be disabled if an order cannot be created.
- The cart should be preserved where practical.
- The user should be invited to try again later.
- The system should not pretend an order was created.

Example user-facing message:

> Ordering is temporarily unavailable. Please try again shortly, or contact Rusty's Sandwich Parlour directly.

### Logging

Server-side logs should include:

- Request path.
- Error category and code returned by Square.
- Order submission identifier or idempotency key.
- Timestamp.

Logs must not include:

- `SQUARE_ACCESS_TOKEN`.
- Full customer phone numbers unless operationally necessary.
- Sensitive request headers.
- Payment data, although no payment data should exist in this build.
