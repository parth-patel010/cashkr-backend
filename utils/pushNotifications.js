/**
 * Send Expo push notifications.
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */
export async function sendExpoPush(messages) {
  const list = (Array.isArray(messages) ? messages : [messages]).filter(
    (m) => m && m.to && typeof m.to === 'string',
  );
  if (!list.length) {
    return { data: [], sent: 0, failed: 0 };
  }

  const chunks = [];
  for (let i = 0; i < list.length; i += 100) {
    chunks.push(list.slice(i, i + 100));
  }

  const results = [];
  let sent = 0;
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });
      const json = await response.json();
      const tickets = Array.isArray(json?.data) ? json.data : [json?.data].filter(Boolean);
      results.push(...tickets);
      for (const ticket of tickets) {
        if (ticket?.status === 'ok') sent += 1;
        else failed += 1;
      }
    } catch (err) {
      failed += chunk.length;
      results.push({ status: 'error', message: err.message });
    }
  }

  return { data: results, sent, failed };
}

export async function notifyUserPushTokens(user, { title, body, data, imageUrl } = {}) {
  if (!user) return { sent: 0, failed: 0 };
  const tokens = Array.isArray(user.pushTokens)
    ? user.pushTokens.filter((t) => typeof t === 'string' && t.trim())
    : [];
  if (!tokens.length) return { sent: 0, failed: 0 };

  const messages = tokens.map((to) => ({
    to,
    sound: 'default',
    title: title || 'DeviceKart',
    body: body || '',
    data: data || {},
    ...(imageUrl ? { richContent: { image: imageUrl } } : {}),
  }));

  return sendExpoPush(messages);
}

export function buildOrderStatusPushBody(orderType, status, order, otp) {
  const id = order?.orderId || '';
  let body = `Your ${orderType} order ${id} is now "${status}".`;
  if (otp) {
    body += ` OTP: ${otp}`;
  }
  return body;
}
