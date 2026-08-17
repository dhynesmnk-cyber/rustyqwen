import axios from 'axios';

const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ errors: [{ detail: 'Method not allowed' }] }),
    };
  }

  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
      console.error('Missing Square configuration');
      return {
        statusCode: 500,
        body: JSON.stringify({ errors: [{ detail: 'Server configuration error' }] }),
      };
    }

    // Fetch catalog objects: items, variations, modifier lists, modifiers, and taxes
    const response = await axios.get(
      `${SQUARE_BASE_URL}/v2/catalog/list`,
      {
        params: {
          types: 'ITEM,ITEM_VARIATION,MODIFIER_LIST,MODIFIER,TAX,CATEGORY',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-12-18',
        },
      }
    );

    const objects = response.data.objects || [];

    // Organize catalog objects by type
    const catalog = {
      items: [],
      variations: {},
      modifierLists: {},
      modifiers: {},
      taxes: [],
      categories: {},
    };

    objects.forEach(obj => {
      switch (obj.type) {
        case 'ITEM':
          catalog.items.push(obj);
          break;
        case 'ITEM_VARIATION':
          catalog.variations[obj.id] = obj;
          break;
        case 'MODIFIER_LIST':
          catalog.modifierLists[obj.id] = obj;
          break;
        case 'MODIFIER':
          catalog.modifiers[obj.id] = obj;
          break;
        case 'TAX':
          catalog.taxes.push(obj);
          break;
        case 'CATEGORY':
          catalog.categories[obj.id] = obj;
          break;
        default:
          break;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(catalog),
    };
  } catch (error) {
    console.error('Catalog fetch error:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        errors: [{
          detail: error.response?.data?.errors?.[0]?.detail || 'Failed to fetch catalog',
        }],
      }),
    };
  }
}
