import express from 'express';
import { sendFacebookEvent } from '../utils/facebookCapi.js';

const router = express.Router();

/**
 * @route POST /api/events/capi
 * @desc Receive events from frontend and forward to Meta Conversions API
 */
router.post('/capi', async (req, res) => {
  const { eventName, customData, eventId, eventSourceUrl, userData } = req.body;

  if (!eventName) {
    return res.status(400).json({ error: 'eventName is required' });
  }

  try {
    const success = await sendFacebookEvent(
      eventName,
      customData || {},
      req,
      eventId,
      eventSourceUrl,
      userData || {}
    );

    if (success) {
      res.status(200).json({ message: 'Event sent to Facebook CAPI successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send event to Facebook CAPI' });
    }
  } catch (error) {
    console.error('CAPI route error:', error);
    res.status(500).json({ error: 'Server error while sending CAPI event' });
  }
});

export default router;
