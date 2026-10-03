let memoryStore = {
  generalViews: 0,
  guests: []
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Try Netlify Blobs if supported in Netlify environment
  let blobStore = null;
  try {
    const { getStore } = require('@netlify/blobs');
    blobStore = getStore('wedding_tracking_store');
  } catch (e) {
    /* fallback to memoryStore */
  }

  if (event.httpMethod === 'GET') {
    if (blobStore) {
      try {
        const data = await blobStore.get('tracking_data', { type: 'json' });
        if (data && typeof data.generalViews === 'number' && Array.isArray(data.guests)) {
          return { statusCode: 200, headers, body: JSON.stringify(data) };
        }
      } catch (e) {
        /* fallback */
      }
    }
    return { statusCode: 200, headers, body: JSON.stringify(memoryStore) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const incomingData = JSON.parse(event.body || '{}');

      if (incomingData && typeof incomingData.generalViews === 'number' && Array.isArray(incomingData.guests)) {
        // Merge incoming data with memory store
        const guestMap = new Map();

        (memoryStore.guests || []).forEach(g => {
          if (g && g.id) guestMap.set(g.id, { ...g });
        });

        (incomingData.guests || []).forEach(g => {
          if (g && g.id) {
            const existing = guestMap.get(g.id);
            if (!existing) {
              guestMap.set(g.id, { ...g });
            } else {
              guestMap.set(g.id, {
                ...existing,
                ...g,
                opened: existing.opened || g.opened,
                openCount: Math.max(existing.openCount || 0, g.openCount || 0),
                lastOpenedAt: g.lastOpenedAt || existing.lastOpenedAt
              });
            }
          }
        });

        memoryStore = {
          generalViews: Math.max(memoryStore.generalViews || 0, incomingData.generalViews || 0),
          guests: Array.from(guestMap.values())
        };

        if (blobStore) {
          try {
            await blobStore.setJSON('tracking_data', memoryStore);
          } catch (e) {
            /* ignore */
          }
        }

        return { statusCode: 200, headers, body: JSON.stringify(memoryStore) };
      }
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
