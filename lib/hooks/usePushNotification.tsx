import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setPushSubscription } from '@/lib/redux/features/metadata/metadataSlice';
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions';
import { toWebPushSubscription } from '@/app/actions'

export const usePushNotifications = () => {
  const dispatch = useAppDispatch();
  const subscription = useAppSelector(state => state.metadata.pushSubscription);

  const handleSubscribe = async (sub: PushSubscription) => {
    const result = await subscribeUser(sub);
    if (result.success) {
      dispatch(setPushSubscription(toWebPushSubscription(sub)));
    }
    return result;
  };

  const handleUnsubscribe = async () => {
    const result = await unsubscribeUser();
    if (result.success) {
      dispatch(setPushSubscription(null));
    }
    return result;
  };

  const handleSendNotification = async (message: string) => {
    const result = await sendNotification(message);
    return result;
  };

  return {
    subscription,
    subscribe: handleSubscribe,
    unsubscribe: handleUnsubscribe,
    sendNotification: handleSendNotification,
    isSubscribed: !!subscription
  };
};