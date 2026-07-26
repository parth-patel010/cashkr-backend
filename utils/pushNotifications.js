/**
 * Send Expo push notifications.
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 * Channel must match the Android channel created in the app (general-notifications).
 */
import { absolutizeMediaUrl } from './mediaUrl.js';

export const PUSH_CHANNEL_ID = 'general-notifications';

export async function sendExpoPush(messages) {
  const list = (Array.isArray(messages) ? messages : [messages])
    .filter((m) => m && m.to && typeof m.to === 'string')
    .map((m) => {
      const image =
        m.richContent?.image ||
        m.imageUrl ||
        (typeof m.data?.imageUrl === 'string' ? m.data.imageUrl : '');
      const absoluteImage = absolutizeMediaUrl(image);
      const rest = { ...m };
      delete rest.imageUrl;
      return {
        sound: 'default',
        priority: 'high',
        ttl: 3600,
        channelId: PUSH_CHANNEL_ID,
        _contentAvailable: true,
        ...rest,
        channelId: rest.channelId || PUSH_CHANNEL_ID,
        priority: rest.priority || 'high',
        ...(absoluteImage
          ? {
              richContent: { image: absoluteImage },
              mutableContent: true,
            }
          : {}),
      };
    });

  if (!list.length) {
    return { data: [], sent: 0, failed: 0, errors: [] };
  }

  const chunks = [];
  for (let i = 0; i < list.length; i += 100) {
    chunks.push(list.slice(i, i + 100));
  }

  const results = [];
  const errors = [];
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
        else {
          failed += 1;
          errors.push(ticket?.message || ticket?.details?.error || 'push failed');
        }
      }
    } catch (err) {
      failed += chunk.length;
      results.push({ status: 'error', message: err.message });
      errors.push(err.message);
    }
  }

  return { data: results, sent, failed, errors };
}

export async function notifyUserPushTokens(user, { title, body, data, imageUrl } = {}) {
  if (!user) return { sent: 0, failed: 0, errors: [] };
  const tokens = Array.isArray(user.pushTokens)
    ? user.pushTokens.filter(
        (t) => typeof t === 'string' && t.trim() && t.startsWith('ExponentPushToken['),
      )
    : [];
  if (!tokens.length) return { sent: 0, failed: 0, errors: ['no expo push tokens'] };

  const absoluteImage = absolutizeMediaUrl(imageUrl);
  const messages = tokens.map((to) => ({
    to,
    sound: 'default',
    title: title || 'DeviceKart',
    body: body || '',
    data: {
      ...(data || {}),
      ...(absoluteImage ? { imageUrl: absoluteImage } : {}),
    },
    priority: 'high',
    channelId: PUSH_CHANNEL_ID,
    ttl: 3600,
    _contentAvailable: true,
    ...(absoluteImage
      ? {
          richContent: { image: absoluteImage },
          mutableContent: true,
        }
      : {}),
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
