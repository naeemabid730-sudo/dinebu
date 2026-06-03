import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import OneSignal from 'onesignal-cordova-plugin';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, notificationsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notification-test',
  templateUrl: './notification-test.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonBadge]
})
export class NotificationTestPage implements OnInit {
  ONESIGNAL_APP_ID = 'bb6f5013-9733-4600-a122-dcb6b8eb4100';
  // ✅ Yahan apni naye generate ki hui key dalen
  REST_API_KEY = 'os_v2_app_xnxvae4xgndabijc3s3lr22baawhqmu734kuzku4e43dgq6iwzgscol3a3cjaqhiksmz62qn2dw3wtqk3jx73fjveatxptc5qswurka';

  myExternalId = 'dinebux_partner_naeem';
  devicePlatform = '';
  oneSignalPlayerId = 'Fetching...';

  constructor() {
    addIcons({ 'paper-plane-outline': paperPlaneOutline, 'notifications-outline': notificationsOutline });
  }

  ngOnInit() {
    this.devicePlatform = Capacitor.getPlatform();
    if (this.devicePlatform !== 'web') this.setupTestingUser();
  }

  async setupTestingUser() {
    OneSignal.initialize(this.ONESIGNAL_APP_ID);
    OneSignal.login(this.myExternalId);
    setTimeout(() => {
        this.oneSignalPlayerId = OneSignal.User.pushSubscription.id || 'Not found';
    }, 2000);
  }

  async sendNotificationToAll() {
    const body = {
      app_id: this.ONESIGNAL_APP_ID,
      included_segments: ['All'],
      contents: { en: 'Hello DineBux! Yeh ek test notification hai.' },
      headings: { en: 'DineBux Alert' }
    };

    try {
      await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.REST_API_KEY}`
        },
        body: JSON.stringify(body)
      });
      console.log("Notification bheja gaya!");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  showDashboardGuide() {
    alert(`1. ID copy karein.\n2. OneSignal Dashboard par jayein.`);
  }
}