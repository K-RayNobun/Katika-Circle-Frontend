import React, { useState, useEffect } from "react";
import { usePushNotifications } from "@/lib/hooks/usePushNotification";


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
  const { subscription, subscribe, unsubscribe, isSubscribed, sendNotification } = usePushNotifications();

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
    return <p>Push notifications are not supported in this browser.</p>
  }
 
  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={handleUnsubscribe}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  )
}

export default PushNotificationManager;