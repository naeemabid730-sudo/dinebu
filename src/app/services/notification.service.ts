import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Messaging } from '@angular/fire/messaging';
import { Capacitor } from '@capacitor/core';
import { getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private firestore: Firestore,
    private messaging: Messaging
  ) { }

  public async initPush(userId: string) {
    if (Capacitor.getPlatform() === 'web') {
      console.log('💻 Web platform detected. Using Web FCM...');
      await this.initWebPush(userId);
    } else {
      await this.initMobilePush(userId);
    }
  }

  private async initWebPush(userId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('❌ Web Notification permission denied!');
        return;
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      console.log('✅ Service Worker registered and ready');

      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('✅ Web FCM Token:', token);
        localStorage.setItem('fcm_token', token);

        if (userId && userId.trim() !== '') {
          await this.saveTokenToFirestore(userId, token);
          console.log('🚀 Web Token Firestore mein save ho gaya!');
        }

        onMessage(this.messaging, (payload) => {
          console.log('📩 Foreground message received:', payload);
          const title = payload.notification?.title || payload.data?.title || 'DineBux';
          const body = payload.notification?.body || payload.data?.body || 'Naya message receive hua hai!';

          new Notification(title, {
            body: body,
            icon: 'assets/q1.png',
            badge: 'assets/q1.png'
          });
        });

      } else {
        console.warn('⚠️ Token nahi mila. Service Worker check karo.');
      }

    } catch (error) {
      console.error('🔥 Web Push Error:', error);
    }
  }

  private async initMobilePush(userId: string) {
    try {
      console.log('🔄 Mobile Push init for User:', userId);

      await PushNotifications.addListener('registration', async (token: Token) => {
        console.log('✅ Mobile FCM Token:', token.value);
        localStorage.setItem('fcm_token', token.value);

        if (userId && userId.trim() !== '') {
          try {
            await this.saveTokenToFirestore(userId, token.value);
            console.log('🚀 Mobile Token Firestore mein save ho gaya!');
          } catch (fsError) {
            console.error('❌ Firestore error:', fsError);
          }
        }
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('❌ Registration Error:', JSON.stringify(error));
      });

      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.error('❌ Mobile permission denied!');
        return;
      }

      await PushNotifications.register();

    } catch (error) {
      console.error('🔥 Mobile Push Error:', error);
    }
  }

  private async saveTokenToFirestore(userId: string, token: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    await setDoc(userDocRef, {
      fcmToken: token,
      tokenUpdatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`💾 Token saved: users/${userId}`);
  }
}