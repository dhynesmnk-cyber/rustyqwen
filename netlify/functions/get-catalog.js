const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

const BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

// Cache for catalog data
let catalogCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = parseInt(process.env.SQUARE_CATALOG_CACHE_TTL_SECONDS || '300') * 1000;

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check cache first
    const now = Date.now();
    if (catalogCache && (now - cacheTimestamp) < CACHE_TTL) {
      console.log('Returning cached catalog');
      return {
        statusCode: 200,
        body: JSON.stringify(catalogCache),
      };
    }

    // Fetch from Square API
    console.log('Fetching catalog from Square API');
    const response = await fetch(
      `${BASE_URL}/v2/catalog/list?types=ITEM,ITEM_VARIATION,MODIFIER_LIST,MODIFIER,TAX`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2023-10-18',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API error:', errorData);
      throw new Error(`Square API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Update cache
    catalogCache = data;
    cacheTimestamp = now;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL / 1000}`,
      },
    };
  } catch (error) {
    console.error('Error fetching catalog:', error);
    
    // Return cached data if available even if stale
    if (catalogCache) {
      console.log('Returning stale cached data');
      return {
        statusCode: 200,
        body: JSON.stringify(catalogCache),
        headers: {
          'Content-Type': 'application/json',
          'X-Cache-Status': 'stale',
        },
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch catalog',
        message: error.message 
      }),
    };
  }
};
