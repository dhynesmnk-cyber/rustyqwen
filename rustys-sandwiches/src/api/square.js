const SQUARE_ENVIRONMENT = import.meta.env.VITE_SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

export async function fetchCatalog() {
  const response = await fetch('/api/catalog');
  if (!response.ok) {
    throw new Error('Failed to fetch catalog');
  }
  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ errors: [{ detail: 'Order creation failed' }] }));
    throw new Error(error.errors?.[0]?.detail || 'Failed to create order');
  }
  
  return response.json();
}
