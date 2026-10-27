import express from 'express';
import User from '../models/user.mode.js';
import { verifyWebhook } from '@clerk/express/webhooks';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  let evt;
  try {
    evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid webhook' });
  }

  try {
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const u = evt.data;
      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const FullName =
        [u.first_name, u.last_name].filter(Boolean).join(' ') ||
        u.username ||
        email?.split('@')[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        { clerkId: u.id, email, FullName, profilePic: u.image_url },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    if (evt.type === 'user.deleted' && evt.data.id) {
      await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ message: 'Webhook failed' });
  }
});

export default router;