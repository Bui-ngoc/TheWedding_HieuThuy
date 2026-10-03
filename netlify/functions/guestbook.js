let memoryMessages = [];

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

  let blobStore = null;
  try {
    const { getStore } = require('@netlify/blobs');
    blobStore = getStore('wedding_guestbook_store');
  } catch (e) {
    /* fallback to memoryMessages */
  }

  if (event.httpMethod === 'GET') {
    if (blobStore) {
      try {
        const stored = await blobStore.get('messages_data', { type: 'json' });
        if (Array.isArray(stored)) {
          return { statusCode: 200, headers, body: JSON.stringify(stored) };
        }
      } catch (e) {
        /* fallback */
      }
    }
    return { statusCode: 200, headers, body: JSON.stringify(memoryMessages) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const incoming = JSON.parse(event.body || '{}');
      if (incoming && incoming.name && incoming.message) {
        const newMsg = {
          id: incoming.id || ('msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)),
          name: incoming.name.trim(),
          relationship: incoming.relationship || 'Khách quý',
          message: incoming.message.trim(),
          createdAt: incoming.createdAt || new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        // Merge into list
        const msgMap = new Map();
        [newMsg, ...memoryMessages].forEach(m => {
          if (m && m.id && !msgMap.has(m.id)) {
            msgMap.set(m.id, m);
          }
        });

        memoryMessages = Array.from(msgMap.values());

        if (blobStore) {
          try {
            await blobStore.setJSON('messages_data', memoryMessages);
          } catch (e) {
            /* ignore */
          }
        }

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: newMsg, allMessages: memoryMessages }) };
      }
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
