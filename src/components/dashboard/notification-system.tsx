'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { useFirebaseApp } from '@/firebase';
import { toast } from '@/hooks/use-toast';

export function NotificationSystem() {
  const app = useFirebaseApp();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported' | 'loading'>('loading');

  useEffect(() => {
    if (!app) return;

    const setupMessaging = async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          setPermission('unsupported');
          return;
        }

        const messaging = getMessaging(app);
        
        // Check current permission
        setPermission(Notification.permission);

        // Only request if default (first time)
        if (Notification.permission === 'default') {
          try {
            const status = await Notification.requestPermission();
            setPermission(status);
          } catch (e) {
            console.warn('Notification permission request failed', e);
          }
        }

        if (Notification.permission === 'granted') {
          // In a real app, you'd use a real VAPID key from Firebase Console
          const currentToken = await getToken(messaging, {
            vapidKey: 'BNo6-Xv9O-M6p0p_REPLACE_WITH_REAL_VAPID_KEY',
          }).catch(err => {
            // Silently fail token retrieval in prototype
            return null;
          });

          if (currentToken) {
            console.log('FCM Token registered');
          }
        }

        onMessage(messaging, (payload) => {
          toast({
            title: payload.notification?.title || 'Study Alert',
            description: payload.notification?.body || 'New update in your study plan.',
          });
        });

      } catch (error) {
        // Silent catch for environments where messaging might not be fully available
        console.log('Messaging setup skipped or failed');
      }
    };

    setupMessaging();
  }, [app]);

  // The system now runs silently in the background without nagging the user
  return null;
}
