'use server'
 
import webpush from 'web-push'
import { store } from '@/lib/redux/store';
import { setPushSubscription } from '@/lib/redux/features/metadata/metadataSlice';

// Add this type to match web-push package requirements
export type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY
}

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  vapidKeys.publicKey!,
  vapidKeys.privateKey!
)
 
export async function subscribeUser(sub: PushSubscription) {
  try {
    const webPushSub = toWebPushSubscription(sub);
    store.dispatch(setPushSubscription(webPushSub));
    return { success: true };
  } catch (error) {
    console.error('Subscription failed:', error);
    return { success: false, error: 'Failed to store subscription' };
  }
}
 
export async function unsubscribeUser() {
  try {
    store.dispatch(setPushSubscription(null));
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    return { success: false, error: 'Failed to remove subscription' };
  }
}

// Convert browser PushSubscription to WebPushSubscription
export function toWebPushSubscription(sub: PushSubscription): WebPushSubscription {
  const json = sub.toJSON();
  return {
    endpoint: json.endpoint!,
    keys: {
      p256dh: json.keys!.p256dh,
      auth: json.keys!.auth
    }
  };
}

// Update the sendNotification function
export async function sendNotification(message: string) {

  try {
    const state = store.getState();
    const subscription = state.metadata.pushSubscription;

    if (!subscription) {
        throw new Error('No subscription available')
    }
    
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'SendbyKatika Notification',
        body: message,
        icon: '/send_logo512.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}