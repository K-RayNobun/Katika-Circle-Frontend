import React, { useState, useEffect } from "react";
import { usePushNotifications } from "@/lib/hooks/usePushNotification";
import { useTranslation } from "@/lib/hooks/useTranslation";


function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const { t } = useTranslation();
  const { subscription, subscribe, unsubscribe, sendNotification } = usePushNotifications();

  const [isSupported, setIsSupported] = useState(false)
  const [message, setMessage] = useState('')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
        })
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            await subscribe(existingSub);
        }
    } catch(error) {
        console.error('Service worker registration failed:', error);
    }
  }
 
  async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready
        const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
        })
        await subscribe(newSubscription);
    } catch (error) {
        console.error('Push subscription failed:', error);
    }
  }
 
  async function handleUnsubscribe() {
    try {
      if (subscription) {
        await unsubscribe();
      }
      await unsubscribe();
    } catch (error) {
      console.error('Push unsubscription failed:', error);
    }
  }

  async function handleTestNotification() {
    try {
      if (message.trim()) {
        await sendNotification(message);
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
 
  if (!isSupported) {
    return <p>{t('pushNotifications.notSupported')}</p>;
  }

  return (
    <div>
      <h3>{t('pushNotifications.title')}</h3>
      {subscription ? (
        <>
          <p>{t('pushNotifications.subscribed')}</p>
          <button onClick={handleUnsubscribe}>
            {t('pushNotifications.buttons.unsubscribe')}
          </button>
          <input
            type="text"
            placeholder={t('pushNotifications.input.placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleTestNotification}>
            {t('pushNotifications.buttons.sendTest')}
          </button>
        </>
      ) : (
        <>
          <p>{t('pushNotifications.notSubscribed')}</p>
          <button onClick={subscribeToPush}>
            {t('pushNotifications.buttons.subscribe')}
          </button>
        </>
      )}
    </div>
  );
}

export default PushNotificationManager;