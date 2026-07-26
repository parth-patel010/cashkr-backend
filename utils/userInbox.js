import UserNotification from '../models/UserNotification.js';
import { absolutizeMediaUrl } from './mediaUrl.js';

/**
 * Fan-out inbox rows for targeted users. Always stores absolute image URLs.
 */
export async function createInboxNotifications(userIds, { title, body, imageUrl, data } = {}) {
  const ids = [...new Set((userIds || []).map((id) => String(id)).filter(Boolean))];
  if (!ids.length || !title || !body) return { created: 0 };

  const absoluteImage = absolutizeMediaUrl(imageUrl) || '';
  const docs = ids.map((userId) => ({
    userId,
    title: String(title).slice(0, 200),
    body: String(body).slice(0, 2000),
    imageUrl: absoluteImage,
    data: data || null,
    readAt: null,
  }));

  try {
    const result = await UserNotification.insertMany(docs, { ordered: false });
    return { created: result.length };
  } catch (err) {
    console.error('createInboxNotifications failed:', err.message);
    return { created: 0, error: err.message };
  }
}
