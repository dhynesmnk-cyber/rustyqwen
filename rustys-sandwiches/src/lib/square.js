const SQUARE_ENVIRONMENT = import.meta.env.VITE_SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || '';

const BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

export async function fetchCatalog() {
  try {
    const response = await fetch('/.netlify/functions/get-catalog');
    
    if (!response.ok) {
      throw new Error('Failed to fetch catalog');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return { objects: [] };
  }
}

export async function createOrder(orderData) {
  try {
    const response = await fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export function formatPrice(amount, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
}

export function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getAvailablePickupTimes() {
  const times = [];
  const now = new Date();
  const minLeadMinutes = parseInt(import.meta.env.VITE_ORDER_MIN_LEAD_MINUTES || '15');
  const maxDaysAhead = parseInt(import.meta.env.VITE_ORDER_MAX_DAYS_AHEAD || '7');
  
  // Business hours (adjust as needed)
  const openHour = 10; // 10 AM
  const closeHour = 18; // 6 PM
  
  const startDate = new Date(now.getTime() + minLeadMinutes * 60000);
  const endDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Skip Sundays (0) if closed
    if (currentDate.getDay() !== 0) {
      for (let hour = openHour; hour < closeHour; hour++) {
        for (let minute of [0, 30]) {
          const timeSlot = new Date(currentDate);
          timeSlot.setHours(hour, minute, 0, 0);
          
          if (timeSlot > startDate && timeSlot <= endDate) {
            times.push(timeSlot.toISOString());
          }
        }
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return times;
}

export function formatPickupTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
