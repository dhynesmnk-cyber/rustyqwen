const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

const BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { idempotencyKey, items, customer, pickupTime, notes } = JSON.parse(event.body);

    // Validate required fields
    if (!idempotencyKey || !items || !customer || !pickupTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          message: 'idempotencyKey, items, customer, and pickupTime are required'
        }),
      };
    }

    // Build line items for Square API
    const lineItems = items.map((item, index) => ({
      uid: `line_item_${index}`,
      quantity: String(item.quantity),
      catalog_object_id: item.catalogObjectId,
      modifiers: item.modifiers?.map((modId, modIndex) => ({
        uid: `modifier_${index}_${modIndex}`,
        catalog_object_id: modId,
      })) || [],
    }));

    // Build the order payload
    const orderPayload = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: SQUARE_LOCATION_ID,
        source: {
          name: "Rusty's Sandwich Parlour Website",
        },
        line_items: lineItems,
        fulfillments: [
          {
            type: 'PICKUP',
            state: 'PROPOSED',
            pickup_details: {
              recipient: {
                display_name: customer.name,
                phone_number: customer.phone,
              },
              pickup_at: pickupTime,
              note: notes || 'Customer will pay at the counter.',
            },
          },
        ],
      },
    };

    console.log('Creating order with Square API');
    const response = await fetch(`${BASE_URL}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API error:', errorData);
      
      let userMessage = 'Failed to create order. Please try again.';
      if (errorData.errors?.[0]?.detail) {
        userMessage = errorData.errors[0].detail;
      }

      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Failed to create order',
          message: userMessage,
        }),
      };
    }

    const data = await response.json();
    console.log('Order created successfully:', data.order?.id);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};
