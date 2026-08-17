# Frontend routes

## Route structure

The frontend should provide a simple, mobile-first ordering journey. The route structure separates dynamic menu pages from static informational pages, with a streamlined checkout flow that does not request payment details.

| Route | Type | Purpose |
|---|---|---|
| `/` | Static or server-rendered | Home page, featured items, order call-to-action |
| `/menu` | Dynamic | Menu listing generated from Square Catalog |
| `/menu/[slug]` | Dynamic | Individual menu item page generated from Square Catalog |
| `/cart` | Dynamic client-side | Cart review and quantity editing |
| `/checkout` | Dynamic client-side | Collect customer details and pickup time |
| `/confirmation` | Dynamic | Confirmation after successful order creation |
| `/catering` | Static | Event catering information |
| `/delivery` | Static | Delivery logistics information |

## Dynamic routes

### Menu listing: `/menu`

The menu listing page should display menu items retrieved from the Square Catalog API.

Expected behaviour:

- Fetch menu items, variations, and related modifier data from the server-side layer.
- Group items into categories if the Square Catalog uses categories.
- Display item name, short description, price, and availability.
- Link each item to its individual menu item page.
- Hide items that are unavailable or not valid for the selected Square location.

### Individual menu item: `/menu/[slug]`

Each menu item should have its own dynamic page.

The page should be populated from the Catalog API and should display:

- Item name.
- Item description.
- Available variations, if applicable.
- Price.
- Required modifier selections.
- Optional modifier selections.
- Quantity selector.
- Add-to-cart action.

Expected behaviour:

- If the item has required modifiers, prevent adding to cart until all required selections are complete.
- If the item is unavailable, show a clear unavailable message instead of an add-to-cart button.
- If the Catalog object cannot be found, return a user-friendly not-found state.
- Use the Square Catalog object ID as the authoritative identifier for cart and order submission.

The URL slug may be generated from the item name, but the underlying data should rely on the Square object ID.

## Static pages

### Event catering: `/catering`

This page is hardcoded and informational.

It should explain:

- Catering options available from Rusty's Sandwich Parlour.
- Typical lead times.
- How to make a catering enquiry.
- Whether catering orders are paid in-store, by invoice, or by another offline process.
- Contact details for catering enquiries.

This page should not imply that large catering orders can be paid online unless that feature is later added.

### Delivery logistics: `/delivery`

This page is hardcoded and informational.

It should explain:

- Whether delivery is available.
- Delivery area or service boundaries.
- Expected delivery time frames.
- Delivery fees, if applicable.
- How delivery orders are placed.
- Whether delivery orders are handled outside the website's current Square pickup flow.

If the current build only supports pickup through Square, the delivery page should clearly state that delivery arrangements are handled separately or by direct contact with the venue.

## Checkout flow

The checkout flow must be streamlined and must not include credit card fields.

### Cart: `/cart`

The cart page should display:

- Cart line items.
- Selected modifiers.
- Quantity controls.
- Line item price.
- Estimated total.
- Remove item action.
- Continue-to-checkout action.

Expected behaviour:

- Cart state may be stored in browser storage for convenience.
- The cart should not store payment information.
- Cart totals are estimates until Square confirms the order total.
- If a cart item becomes unavailable before checkout, the user should be warned.

### Checkout: `/checkout`

The checkout page collects only the information required for a pickup order.

Required fields:

- Customer name.
- Phone number.
- Preferred pickup time.

Optional fields:

- Order note.
- Contact preference, if operationally useful.

The checkout page must not include:

- Card number fields.
- Expiry date fields.
- CVV fields.
- Billing address fields for payment purposes.
- Online payment buttons.
- Third-party payment widgets.

### Payment commitment warning

Before submitting the order, the customer must be clearly warned that they are committing to an order that must be paid for upon arrival.

Recommended warning copy:

> By placing this order, you agree to collect it from Rusty's Sandwich Parlour and pay for it at the venue. Payment is not taken online.

Recommended implementation:

- Display the warning near the submit button.
- Require an explicit acknowledgement checkbox, such as:

> I understand that I must pay for this order when I collect it.

The acknowledgement should be required before the order can be submitted.

### Checkout submission

When the customer submits checkout:

1. Validate the form fields.
2. Validate the pickup time against business rules.
3. Disable the submit button to prevent duplicate submissions.
4. Send the cart and customer details to the server-side order creation function.
5. Wait for the Square order response.
6. If successful, clear the cart and show the confirmation screen.
7. If unsuccessful, show a helpful error message and preserve the cart where practical.

### Pickup time logic

The pickup time selector should:

- Only allow valid business hours.
- Enforce a minimum preparation lead time.
- Prevent selection of past times.
- Optionally limit how many days ahead a customer can order.
- Use Australian date and time formatting.

Example:

> Monday, 17 August, 12:30 pm

### Confirmation screen

After a successful order creation, the confirmation screen should display:

- A clear success message.
- Square order ID or shortened order reference.
- Customer name.
- Pickup time.
- Order total due.
- Venue address.
- A reminder that payment is required at the venue.

Recommended confirmation copy:

> Thanks, your order has been received. Please pay at the counter when you collect your order.

The confirmation screen should also tell the customer what to do if there is a problem, such as arriving outside business hours or needing to change the order.
