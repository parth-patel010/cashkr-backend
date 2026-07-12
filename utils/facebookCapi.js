import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const PIXEL_ID = process.env.FB_PIXEL_ID || '1003046282498279';
const ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;
const API_VERSION = process.env.FB_API_VERSION || 'v20.0';

/**
 * Hash data using SHA-256 for Facebook CAPI requirements
 */
const hashData = (data) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

/**
 * Send event to Facebook Conversions API
 * @param {string} eventName (e.g., 'Purchase', 'Lead', 'ViewContent')
 * @param {object} customData (e.g., { currency: 'INR', value: 100 })
 * @param {object} req Express request object for IP and UserAgent
 * @param {string} eventId Unique ID for deduplication
 * @param {string} eventSourceUrl URL where event occurred
 * @param {object} userData User data like email, phone
 */
export const sendFacebookEvent = async (eventName, customData, req, eventId, eventSourceUrl, userData = {}) => {
  if (!ACCESS_TOKEN) {
    console.warn('Facebook CAPI Access Token not found. Skipping event.', eventName);
    return false;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  // Extract IP and UserAgent
  const clientIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientUserAgent = req.headers['user-agent'];

  const formattedUserData = {
    client_ip_address: clientIpAddress,
    client_user_agent: clientUserAgent,
  };

  if (userData.email) {
    formattedUserData.em = [hashData(userData.email)];
  }
  if (userData.phone) {
    formattedUserData.ph = [hashData(userData.phone.toString())];
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl || req.headers.referer,
        action_source: "website",
        user_data: formattedUserData,
        custom_data: customData
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.error) {
      console.error('Facebook CAPI Error:', result.error);
      return false;
    }
    console.log(`Facebook CAPI Event sent successfully: ${eventName}`);
    return true;
  } catch (error) {
    console.error('Failed to send Facebook CAPI Event:', error);
    return false;
  }
};
